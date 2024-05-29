import { e as error } from './index-C-arhqvZ.js';
import { readFile, writeFile } from 'node:fs/promises';
import superagent from 'superagent';
import { d as private_env } from './shared-server-BfUoNEXY.js';
import { B as BaseCache } from './BaseCache-BtPY9_DY.js';
import { B as BaseLogger } from './BaseLogger-B58-fQ4u.js';
import { g as getData$1 } from './data2-DqJThwBE.js';
import { Client } from '@googlemaps/google-maps-services-js';

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
const GOOGLE_KEY = private_env.GOOGLE_KEY;
const CACHE_FILE = "data/weather.json";
const FORECAST_URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const GEOCODE_URL = `https://api.openweathermap.org/geo/1.0/reverse?limit=3`;
const ICON_PREFIX = "/icons/";
const ICON_SUFFIX = ".png";
const logger = new BaseLogger("WEATHER");
const cache = new BaseCache(logger, CACHE_TIME);
const client = new Client({});
let location = JSON.parse(
  await readFile(CACHE_FILE, "utf-8").catch(() => '{ "lat": 0, "lng": 0 }')
);
async function getData(forceUpdate = false) {
  if (!ENABLED) {
    throw error(400, {
      message: `Weather is disabled`,
      key: "weather.disabled"
    });
  }
  return cache.withDefault(forceUpdate, async () => {
    let latitude = BASE_LAT;
    let longitude = BASE_LNG;
    const modemData = await getData$1().catch(() => null);
    if (modemData) {
      if (modemData.gps) {
        logger.debug("Using gps modem location", modemData.gps);
        latitude = modemData.gps.lat;
        longitude = modemData.gps.lng;
      } else if (modemData.geo) {
        logger.debug("Using geo modem location", modemData.geo);
        latitude = modemData.geo.lat;
        longitude = modemData.geo.lng;
      }
    }
    const forecastUrl = `${FORECAST_URL}&appid=${API_KEY}&lat=${latitude}&lon=${longitude}`;
    const { body } = await superagent.get(forecastUrl);
    const lat = body.lat;
    const lng = body.lon;
    let place = location?.place;
    const dist = distance(lat, lng, location.lat, location.lng);
    if (!location.place || dist > MIN_DIFF) {
      place = void 0;
      logger.info("Moved", dist, "meters, recalculating location");
      const geocodeUrl = `${GEOCODE_URL}&appid=${API_KEY}&lat=${lat}&lon=${lng}`;
      const { body: body2 } = await superagent.get(geocodeUrl).catch(() => ({ body: [] }));
      const result = body2[0];
      if (result) {
        place = `${result.name}, ${result.state}, ${result.country}`;
      } else {
        logger.debug("Could not find place, trying google geocode...");
        const { data: geoData } = await client.reverseGeocode({
          params: {
            key: GOOGLE_KEY,
            latlng: { lat, lng }
          }
        });
        const addr = geoData.results?.find((r) => r.types.some((t) => t !== "plus_code"));
        if (addr) {
          place = addr?.formatted_address;
        } else {
          logger.debug("Unknown place");
        }
      }
      location = { lat, lng, place };
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
//# sourceMappingURL=data7-eAiew49a.js.map
