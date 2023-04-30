import { isAfter, differenceInSeconds } from 'date-fns';
import { b as private_env } from './shared-server-b7e48788.js';
import { r as redirect } from './index-39e97e00.js';
import superagent from 'superagent';

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
const BASE_LAT = private_env.WEATHER_LAT;
const BASE_LNG = private_env.WEATHER_LNG;
const API_KEY = private_env.WEATHER_API_KEY;
const NUM_FORECASTS = 7;
const URL = `https://api.openweathermap.org/data/3.0/onecall?lang=de&units=metric&exclude=current,minutely`;
const load = async () => {
  if (!ENABLED) {
    throw redirect(302, "/screens");
  }
  const { alerts: alerts2, hourly: hourly2, daily: daily2 } = await getWeather();
  const now = /* @__PURE__ */ new Date();
  return {
    alerts: alerts2,
    hourly: hourly2.filter((f) => isAfter(f.ts, now)).filter((_, i) => i % 2 === 0).slice(0, NUM_FORECASTS),
    daily: daily2.slice(0, NUM_FORECASTS)
  };
};
let alerts = [];
let hourly = [];
let daily = [];
let cachedAt = /* @__PURE__ */ new Date(0);
async function getWeather(latitude, longitude) {
  if (differenceInSeconds(/* @__PURE__ */ new Date(), cachedAt) <= CACHE_TIME) {
    return { alerts, hourly, daily };
  }
  const lat = latitude || BASE_LAT;
  const lng = longitude || BASE_LNG;
  const url = `${URL}&appid=${API_KEY}&lat=${lat}&lon=${lng}`;
  const newAlerts = [];
  const newHourly = [];
  const newDaily = [];
  const { body } = await superagent.get(url);
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
  alerts = newAlerts;
  hourly = newHourly;
  daily = newDaily;
  cachedAt = /* @__PURE__ */ new Date();
  return { alerts, hourly, daily };
}

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 5;
const component = async () => (await import('./layout.svelte-cbbd1799.js')).default;
const server_id = "src/routes/(main)/screens/weather/+layout.server.ts";
const imports = ["_app/immutable/entry/layout.svelte.51caf022.js","_app/immutable/chunks/index.71ce2ac2.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-dbcdb21d.js.map
