const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","fonts/icofont.eot","fonts/icofont.svg","fonts/icofont.ttf","fonts/icofont.woff","fonts/icofont.woff2","icofont.min.css","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".eot":"application/vnd.ms-fontobject",".svg":"image/svg+xml",".ttf":"font/ttf",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.1aef6824.js","app":"_app/immutable/entry/app.8574e424.js","imports":["_app/immutable/entry/start.1aef6824.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/singletons.1b6267c0.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/entry/app.8574e424.js","_app/immutable/chunks/index.b6851cfd.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-23f1fb58.js'),
			() => import('./chunks/1-6b3a7c43.js'),
			() => import('./chunks/2-104dc45c.js'),
			() => import('./chunks/3-e4e7ea6a.js'),
			() => import('./chunks/4-bce72274.js'),
			() => import('./chunks/5-022b0486.js'),
			() => import('./chunks/6-fbbf817c.js'),
			() => import('./chunks/7-f4d49c8c.js'),
			() => import('./chunks/8-9ea67926.js'),
			() => import('./chunks/9-49e4799f.js'),
			() => import('./chunks/10-baf99248.js'),
			() => import('./chunks/11-fc8cc0fe.js'),
			() => import('./chunks/12-349c8b71.js'),
			() => import('./chunks/13-506156a1.js'),
			() => import('./chunks/14-2303932d.js'),
			() => import('./chunks/15-d101b9a1.js'),
			() => import('./chunks/16-01e5a002.js'),
			() => import('./chunks/17-8e6db3dd.js'),
			() => import('./chunks/18-c8fcac3a.js'),
			() => import('./chunks/19-6debb36d.js'),
			() => import('./chunks/20-08694bfb.js'),
			() => import('./chunks/21-40357d1c.js'),
			() => import('./chunks/22-9359cd79.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/battery",
				pattern: /^\/battery\/?$/,
				params: [],
				page: { layouts: [0,,], errors: [1,2,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/modem",
				pattern: /^\/modem\/?$/,
				params: [],
				page: { layouts: [0,,], errors: [1,3,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/network",
				pattern: /^\/network\/?$/,
				params: [],
				page: { layouts: [0,,], errors: [1,4,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/screens",
				pattern: /^\/screens\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/screens/calendar",
				pattern: /^\/screens\/calendar\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/screens/games",
				pattern: /^\/screens\/games\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/screens/news/[feed]",
				pattern: /^\/screens\/news\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/screens/news/[feed]/[article]",
				pattern: /^\/screens\/news\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false},{"name":"article","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/screens/post",
				pattern: /^\/screens\/post\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/screens/sbb",
				pattern: /^\/screens\/sbb\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/screens/uploads",
				pattern: /^\/screens\/uploads\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/screens/weather/alerts",
				pattern: /^\/screens\/weather\/alerts\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/screens/weather/daily",
				pattern: /^\/screens\/weather\/daily\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/screens/weather/hourly",
				pattern: /^\/screens\/weather\/hourly\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/uploads",
				pattern: /^\/uploads\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
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
