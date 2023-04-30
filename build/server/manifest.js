const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","fonts/icofont.eot","fonts/icofont.svg","fonts/icofont.ttf","fonts/icofont.woff","fonts/icofont.woff2","icofont.min.css","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".eot":"application/vnd.ms-fontobject",".svg":"image/svg+xml",".ttf":"font/ttf",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.7bb05114.js","app":"_app/immutable/entry/app.182dcfba.js","imports":["_app/immutable/entry/start.7bb05114.js","_app/immutable/chunks/index.71ce2ac2.js","_app/immutable/chunks/singletons.78f8de26.js","_app/immutable/chunks/index.b74bfe1d.js","_app/immutable/chunks/control.e7f5239e.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/entry/app.182dcfba.js","_app/immutable/chunks/index.71ce2ac2.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-0245e9cc.js'),
			() => import('./chunks/1-a293b01a.js'),
			() => import('./chunks/2-dd3f732b.js'),
			() => import('./chunks/3-4904b09d.js'),
			() => import('./chunks/4-661662be.js'),
			() => import('./chunks/5-dbcdb21d.js'),
			() => import('./chunks/6-28bfde55.js'),
			() => import('./chunks/7-3009726d.js'),
			() => import('./chunks/8-2ad0d42b.js'),
			() => import('./chunks/9-b2c0ed47.js'),
			() => import('./chunks/10-8e467f1e.js'),
			() => import('./chunks/11-9f0cebe2.js'),
			() => import('./chunks/12-1146f818.js'),
			() => import('./chunks/13-8cf8e607.js'),
			() => import('./chunks/14-450421eb.js'),
			() => import('./chunks/15-e9843f18.js'),
			() => import('./chunks/16-d00e6f22.js'),
			() => import('./chunks/17-70094fbb.js'),
			() => import('./chunks/18-e0b6bb42.js'),
			() => import('./chunks/19-720f5dd7.js'),
			() => import('./chunks/20-cc0ab186.js'),
			() => import('./chunks/21-f732be6b.js')
		],
		routes: [
			{
				id: "/(main)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(main)/battery",
				pattern: /^\/battery\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(main)/modem",
				pattern: /^\/modem\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(main)/screens",
				pattern: /^\/screens\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(main)/screens/calendar",
				pattern: /^\/screens\/calendar\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(main)/screens/games",
				pattern: /^\/screens\/games\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(main)/screens/news/[feed]",
				pattern: /^\/screens\/news\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4], errors: [1,,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(main)/screens/news/[feed]/[article]",
				pattern: /^\/screens\/news\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false},{"name":"article","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0], errors: [1], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(main)/screens/post",
				pattern: /^\/screens\/post\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(main)/screens/sbb",
				pattern: /^\/screens\/sbb\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(main)/screens/uploads",
				pattern: /^\/screens\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/alerts",
				pattern: /^\/screens\/weather\/alerts\/?$/,
				params: [],
				page: { layouts: [0,2,3,5], errors: [1,,,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/daily",
				pattern: /^\/screens\/weather\/daily\/?$/,
				params: [],
				page: { layouts: [0,2,3,5], errors: [1,,,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/hourly",
				pattern: /^\/screens\/weather\/hourly\/?$/,
				params: [],
				page: { layouts: [0,2,3,5], errors: [1,,,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(main)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/(main)/uploads",
				pattern: /^\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 21 },
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
