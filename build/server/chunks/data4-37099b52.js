import { e as error } from './index-39e97e00.js';
import { readFile, writeFile } from 'node:fs/promises';
import superagent from 'superagent';
import { b as private_env } from './shared-server-b7e48788.js';
import { B as BaseCache } from './BaseCache-8b1d2e36.js';
import { B as BaseLogger } from './BaseLogger-d23f9d0c.js';
import { g as getData$1 } from './data2-a2cf8fda.js';

const IconMap = {
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
const ICON_PREFIX = "/icons/";
const ICON_SUFFIX = ".png";
const logger = new BaseLogger("WEATHER");
const cache = new BaseCache(logger, CACHE_TIME);
let location = JSON.parse(
  await readFile(CACHE_FILE, "utf-8").catch(() => "{ lat: 0, lng: 0 }")
);
async function getData(forceUpdate = false) {
  return cache.withDefault(forceUpdate, async () => {
    if (!ENABLED) {
      throw error(400, {
        message: `Weather is disabled`,
        key: "weather.disabled"
      });
    }
    let latitude = BASE_LAT;
    let longitude = BASE_LNG;
    const modemData = await getData$1().catch(() => null);
    if (modemData && modemData.lat && modemData.lng) {
      logger.debug("Using modem location", modemData.lat, modemData.lng);
      latitude = modemData.lat;
      longitude = modemData.lng;
    }
    const forecastUrl = `${FORECAST_URL}&appid=${API_KEY}&lat=${latitude}&lon=${longitude}`;
    const { body } = await superagent.get(forecastUrl);
    const lat = body.lat;
    const lng = body.lon;
    let place = location?.place;
    const dist = distance(lat, lng, location.lat, location.lng);
    if (!location.place || dist > MIN_DIFF) {
      logger.info("Moved", dist, "meters, recalculating location");
      const geocodeUrl = `${GEOCODE_URL}&appid=${API_KEY}&lat=${lat}&lon=${lng}`;
      const { body: body2 } = await superagent.get(geocodeUrl).catch(() => ({ body: [] }));
      const result = body2[0];
      place = result ? { name: result.name, state: result.state, country: result.country } : void 0;
      await writeFile(CACHE_FILE, JSON.stringify({ lat, lng, place }), "utf-8");
    } else {
      logger.debug(
        "Weather location moved by",
        distance(lat, lng, location.lat, location.lng),
        "meters"
      );
    }
    const alerts = [];
    if (body.alerts) {
      for (const alert of body.alerts) {
        alerts.push({
          sender: alert.sender_name,
          event: alert.event,
          start: new Date(alert.start * 1e3),
          end: new Date(alert.end * 1e3),
          content: alert.description,
          tags: alert.tags
        });
      }
    }
    const hourly = [];
    for (const forecast of body.hourly) {
      hourly.push({
        ts: new Date(forecast.dt * 1e3),
        img: getIcon(forecast.weather[0].id),
        feelsLike: forecast.feels_like
      });
    }
    const daily = [];
    for (const forecast of body.daily) {
      daily.push({
        ts: new Date(forecast.dt * 1e3),
        img: getIcon(forecast.weather[0].id),
        feelsLike: forecast.feels_like.day
      });
    }
    location = { lat, lng, place };
    return {
      ts: /* @__PURE__ */ new Date(),
      location,
      alerts,
      hourly,
      daily
    };
  });
}
function getIcon(id) {
  return ICON_PREFIX + IconMap[id] + ICON_SUFFIX;
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

export { getData as g };
//# sourceMappingURL=data4-37099b52.js.map
