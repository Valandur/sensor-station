const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","fonts/icofont.eot","fonts/icofont.svg","fonts/icofont.ttf","fonts/icofont.woff","fonts/icofont.woff2","icofont.min.css","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".eot":"application/vnd.ms-fontobject",".svg":"image/svg+xml",".ttf":"font/ttf",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.82f177d1.js","app":"_app/immutable/entry/app.be266934.js","imports":["_app/immutable/entry/start.82f177d1.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/singletons.ecd09117.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/control.e7f5239e.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/entry/app.be266934.js","_app/immutable/chunks/index.376c5e2b.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-0cd48012.js'),
			() => import('./chunks/1-3b707f44.js'),
			() => import('./chunks/2-9ee2fade.js'),
			() => import('./chunks/3-c62f4fc0.js'),
			() => import('./chunks/4-68db6c04.js'),
			() => import('./chunks/5-50ad4e8c.js'),
			() => import('./chunks/6-f502bf35.js'),
			() => import('./chunks/7-252d4aff.js'),
			() => import('./chunks/8-dbe2fa7b.js'),
			() => import('./chunks/9-b252044c.js'),
			() => import('./chunks/10-b4b3d258.js'),
			() => import('./chunks/11-595e1bad.js'),
			() => import('./chunks/12-bb2b179e.js'),
			() => import('./chunks/13-67db566e.js'),
			() => import('./chunks/14-6f3f5f4f.js'),
			() => import('./chunks/15-f2367194.js'),
			() => import('./chunks/16-203bf885.js'),
			() => import('./chunks/17-7641ac35.js'),
			() => import('./chunks/18-9d5f873b.js'),
			() => import('./chunks/19-541a0792.js'),
			() => import('./chunks/20-473ba783.js'),
			() => import('./chunks/21-22681dd0.js'),
			() => import('./chunks/22-28b434f7.js'),
			() => import('./chunks/23-d200847d.js')
		],
		routes: [
			{
				id: "/(main)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,3], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(main)/battery",
				pattern: /^\/battery\/?$/,
				params: [],
				page: { layouts: [0,2,,], errors: [1,3,4], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(main)/modem",
				pattern: /^\/modem\/?$/,
				params: [],
				page: { layouts: [0,2,,], errors: [1,3,5], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(main)/screens",
				pattern: /^\/screens\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(main)/screens/calendar",
				pattern: /^\/screens\/calendar\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(main)/screens/games",
				pattern: /^\/screens\/games\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(main)/screens/news/[feed]",
				pattern: /^\/screens\/news\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(main)/screens/news/[feed]/[article]",
				pattern: /^\/screens\/news\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false},{"name":"article","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0], errors: [1], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(main)/screens/post",
				pattern: /^\/screens\/post\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(main)/screens/sbb",
				pattern: /^\/screens\/sbb\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(main)/screens/uploads",
				pattern: /^\/screens\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/alerts",
				pattern: /^\/screens\/weather\/alerts\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/daily",
				pattern: /^\/screens\/weather\/daily\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/hourly",
				pattern: /^\/screens\/weather\/hourly\/?$/,
				params: [],
				page: { layouts: [0,2,6], errors: [1,3,7], leaf: 21 },
				endpoint: null
			},
			{
				id: "/(main)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,3], leaf: 22 },
				endpoint: null
			},
			{
				id: "/(main)/uploads",
				pattern: /^\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,3], leaf: 23 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
