import { d as dev } from './environment-19782cc3.js';
import { differenceInSeconds } from 'date-fns';
import { e as error } from './index-39e97e00.js';
import { readFile, writeFile } from 'node:fs/promises';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { L as Logger } from './logger-515117da.js';
import { g as getStatus } from './modem-5de790e2.js';

const PREFIX = "/icons/";
const SUFFIX = ".png";
function getIcon(id) {
  return PREFIX + ICON_MAP[id] + SUFFIX;
}
const ICON_MAP = {
  200: "thunderstorm",
  201: "thunderstorm",
  202: "thunderstorm",
  210: "thunderstorm",
  211: "thunderstorm",
  212: "thunderstorm",
  221: "thunderstorm",
  230: "thunderstorm",
  231: "thunderstorm",
  232: "thunderstorm",
  300: "drizzle",
  301: "drizzle",
  302: "drizzle",
  310: "drizzle",
  311: "drizzle",
  312: "drizzle",
  313: "drizzle",
  314: "drizzle",
  321: "drizzle",
  500: "rain",
  501: "rain",
  502: "heavyrain",
  503: "heavyrain",
  504: "heavyrain",
  511: "snow",
  520: "drizzle",
  521: "drizzle",
  522: "drizzle",
  531: "drizzle",
  600: "snow",
  601: "snow",
  602: "heavysnow",
  611: "snow",
  612: "snow",
  613: "snow",
  615: "snow",
  616: "snow",
  620: "snow",
  621: "snow",
  622: "heavysnow",
  701: "foggy",
  711: "foggy",
  721: "foggy",
  731: "sandstorm",
  741: "foggy",
  751: "sand",
  761: "sand",
  762: "sand",
  771: "wind",
  781: "tornado",
  800: "clear",
  801: "clouds",
  802: "clouds",
  803: "overcast",
  804: "overcast"
};
const ENABLED = private_env.WEATHER_ENABLED === "1";
const CACHE_TIME = Number(private_env.WEATHER_CACHE_TIME);
const BASE_LAT = Number(private_env.WEATHER_LAT);
const BASE_LNG = Number(private_env.WEATHER_LNG);
const MIN_DIFF = Number(private_env.WEATHER_MIN_DIFF);
const API_KEY = private_env.WEATHER_API_KEY;
const CACHE_FILE = "data/weather.json";
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const logger = new Logger("WEATHER");
let loaded = false;
let location = { lat: BASE_LAT, lng: BASE_LNG };
let alerts = [];
let hourly = [];
let daily = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getAlerts() {
  const { location: location2, alerts: alerts2 } = await getWeather();
  return [location2, alerts2];
}
async function getHourly() {
  const { location: location2, hourly: hourly2 } = await getWeather();
  return [location2, hourly2];
}
async function getDaily() {
  const { location: location2, daily: daily2 } = await getWeather();
  return [location2, daily2];
}
async function getWeather() {
  if (!ENABLED) {
    throw error(400, { message: "Weather module is disabled", key: "weather.disabled" });
  }
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    logger.debug("Using cached weather");
    return { location, alerts, hourly, daily };
  }
  logger.debug("Updating...");
  const startTime = process.hrtime.bigint();
  try {
    const newLocation = await getNewLocation();
    const newAlerts = [];
    const newHourly = [];
    const newDaily = [];
    const forecastUrl = `${FORECAST_URL}&appid=${API_KEY}&lat=${newLocation.lat}&lon=${newLocation.lng}`;
    const { body } = await superagent.get(forecastUrl);
    logger.debug(
      "Weather location off by",
      distance(newLocation.lat, newLocation.lng, body.lat, body.lon),
      "meters"
    );
    if (body.alerts) {
      for (const alert of body.alerts) {
        newAlerts.push({
          sender: alert.sender_name,
          event: alert.event,
          start: new Date(alert.start * 1e3),
          end: new Date(alert.end * 1e3),
          content: alert.description,
          tags: alert.tags
        });
      }
    }
    for (const forecast of body.hourly) {
      newHourly.push({
        ts: new Date(forecast.dt * 1e3),
        img: getIcon(forecast.weather[0].id),
        feelsLike: forecast.feels_like
      });
    }
    for (const forecast of body.daily) {
      newDaily.push({
        ts: new Date(forecast.dt * 1e3),
        img: getIcon(forecast.weather[0].id),
        feelsLike: forecast.feels_like.day
      });
    }
    if (dev && newAlerts.length === 0)
      ;
    location = newLocation;
    alerts = newAlerts;
    hourly = newHourly;
    daily = newDaily;
    cachedAt = /* @__PURE__ */ new Date();
    return { location, alerts, hourly, daily };
  } catch (err) {
    throw logger.toSvelteError(err);
  } finally {
    const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
    logger.info("Updated", diffTime, "ms");
  }
}
async function getNewLocation() {
  logger.debug("Getting location...");
  const startTime = process.hrtime.bigint();
  let newLoc = { ...location };
  if (!loaded) {
    const data = JSON.parse(await readFile(CACHE_FILE, "utf-8").catch(() => "null"));
    if (data) {
      location = newLoc = data;
      loaded = true;
    }
  }
  const modemInfo = await getStatus().catch(() => null);
  if (modemInfo && modemInfo.lat && modemInfo.lng) {
    logger.debug("Using modem location", newLoc.lat, newLoc.lng);
    newLoc = { ...newLoc, lat: modemInfo.lat, lng: modemInfo.lng };
  }
  const dist = distance(newLoc.lat, newLoc.lng, location.lat, location.lng);
  if (dist > MIN_DIFF) {
    logger.debug("Moved", dist, "meters, recalculating location");
    const geocodeUrl = `${GEOCODE_URL}&appid=${API_KEY}&lat=${newLoc.lat}&lon=${newLoc.lng}`;
    const { body } = await superagent.get(geocodeUrl);
    const result = body[0];
    newLoc.place = { name: result.name, state: result.state, country: result.country };
    await writeFile(CACHE_FILE, JSON.stringify(newLoc), "utf-8");
  }
  const diffTime = (process.hrtime.bigint() - startTime) / 1000000n;
  logger.info(
    "Got location",
    newLoc.lat,
    newLoc.lng,
    newLoc.place?.name,
    newLoc.place?.state,
    newLoc.place?.country,
    "in",
    diffTime,
    "ms"
  );
  return newLoc;
}
function distance(lat1, lng1, lat2, lng2) {
  const R = 6378.137;
  const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  const dLon = lng2 * Math.PI / 180 - lng1 * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1e3;
}

export { ENABLED as E, getDaily as a, getHourly as b, getAlerts as g };
//# sourceMappingURL=weather-e74de6ac.js.map
