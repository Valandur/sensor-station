const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","fonts/icofont.eot","fonts/icofont.svg","fonts/icofont.ttf","fonts/icofont.woff","fonts/icofont.woff2","icofont.min.css","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".eot":"application/vnd.ms-fontobject",".svg":"image/svg+xml",".ttf":"font/ttf",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.a08325b9.js","app":"_app/immutable/entry/app.4bebfb48.js","imports":["_app/immutable/entry/start.a08325b9.js","_app/immutable/chunks/index.376c5e2b.js","_app/immutable/chunks/singletons.e1175f78.js","_app/immutable/chunks/index.5120e63e.js","_app/immutable/chunks/control.e7f5239e.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/entry/app.4bebfb48.js","_app/immutable/chunks/index.376c5e2b.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-19897a56.js'),
			() => import('./chunks/1-eba22865.js'),
			() => import('./chunks/2-c211702a.js'),
			() => import('./chunks/3-06374ed5.js'),
			() => import('./chunks/4-6dcf4bad.js'),
			() => import('./chunks/5-28bc6637.js'),
			() => import('./chunks/6-d7bef35f.js'),
			() => import('./chunks/7-45eb964e.js'),
			() => import('./chunks/8-b0afc97a.js'),
			() => import('./chunks/9-65551fe9.js'),
			() => import('./chunks/10-fcddd300.js'),
			() => import('./chunks/11-e6e7da4b.js'),
			() => import('./chunks/12-9505dfbc.js'),
			() => import('./chunks/13-9a50066e.js'),
			() => import('./chunks/14-3e25d27b.js'),
			() => import('./chunks/15-d083390e.js'),
			() => import('./chunks/16-7e62b25d.js'),
			() => import('./chunks/17-258c245b.js'),
			() => import('./chunks/18-3286b9c4.js'),
			() => import('./chunks/19-c4db5fea.js'),
			() => import('./chunks/20-f1511a98.js')
		],
		routes: [
			{
				id: "/(main)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(main)/battery",
				pattern: /^\/battery\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(main)/modem",
				pattern: /^\/modem\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(main)/screens",
				pattern: /^\/screens\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(main)/screens/calendar",
				pattern: /^\/screens\/calendar\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(main)/screens/games",
				pattern: /^\/screens\/games\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(main)/screens/news/[feed]",
				pattern: /^\/screens\/news\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(main)/screens/news/[feed]/[article]",
				pattern: /^\/screens\/news\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false},{"name":"article","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0], errors: [1], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(main)/screens/post",
				pattern: /^\/screens\/post\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(main)/screens/sbb",
				pattern: /^\/screens\/sbb\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(main)/screens/uploads",
				pattern: /^\/screens\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 15 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/alerts",
				pattern: /^\/screens\/weather\/alerts\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 16 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/daily",
				pattern: /^\/screens\/weather\/daily\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 17 },
				endpoint: null
			},
			{
				id: "/(main)/screens/weather/hourly",
				pattern: /^\/screens\/weather\/hourly\/?$/,
				params: [],
				page: { layouts: [0,2,3], errors: [1,,4], leaf: 18 },
				endpoint: null
			},
			{
				id: "/(main)/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/(main)/uploads",
				pattern: /^\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 20 },
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
