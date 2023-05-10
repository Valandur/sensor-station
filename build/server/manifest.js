const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","fonts/icofont.eot","fonts/icofont.svg","fonts/icofont.ttf","fonts/icofont.woff","fonts/icofont.woff2","icofont.min.css","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".eot":"application/vnd.ms-fontobject",".svg":"image/svg+xml",".ttf":"font/ttf",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.84af277a.js","app":"_app/immutable/entry/app.a7ed2266.js","imports":["_app/immutable/entry/start.84af277a.js","_app/immutable/chunks/index.b6851cfd.js","_app/immutable/chunks/singletons.4564e98c.js","_app/immutable/chunks/index.74376673.js","_app/immutable/chunks/parse.d12b0d5b.js","_app/immutable/entry/app.a7ed2266.js","_app/immutable/chunks/index.b6851cfd.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./chunks/0-3409d137.js'),
			() => import('./chunks/1-c00591f3.js'),
			() => import('./chunks/2-08c57b88.js'),
			() => import('./chunks/3-74ac59b5.js'),
			() => import('./chunks/4-f783e616.js'),
			() => import('./chunks/5-1f226824.js'),
			() => import('./chunks/6-3b1139f1.js'),
			() => import('./chunks/7-4e89708b.js'),
			() => import('./chunks/8-ebaa3529.js'),
			() => import('./chunks/9-1633cf53.js'),
			() => import('./chunks/10-885d3a48.js'),
			() => import('./chunks/11-f29c8f0a.js'),
			() => import('./chunks/12-e2b41830.js'),
			() => import('./chunks/13-a168b20a.js'),
			() => import('./chunks/14-fb5103e7.js'),
			() => import('./chunks/15-bd009fa6.js'),
			() => import('./chunks/16-ca620ed5.js'),
			() => import('./chunks/17-85221ed2.js'),
			() => import('./chunks/18-e9490486.js'),
			() => import('./chunks/19-22d85d8c.js'),
			() => import('./chunks/20-9c335fba.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/battery",
				pattern: /^\/battery\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/modem",
				pattern: /^\/modem\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/network",
				pattern: /^\/network\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/screens",
				pattern: /^\/screens\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/screens/calendar",
				pattern: /^\/screens\/calendar\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/screens/games",
				pattern: /^\/screens\/games\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/screens/news/[feed]",
				pattern: /^\/screens\/news\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/screens/news/[feed]/[article]",
				pattern: /^\/screens\/news\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"feed","optional":false,"rest":false,"chained":false},{"name":"article","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/screens/post",
				pattern: /^\/screens\/post\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/screens/sbb",
				pattern: /^\/screens\/sbb\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/screens/uploads",
				pattern: /^\/screens\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/screens/weather/alerts",
				pattern: /^\/screens\/weather\/alerts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/screens/weather/daily",
				pattern: /^\/screens\/weather\/daily\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/screens/weather/hourly",
				pattern: /^\/screens\/weather\/hourly\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/uploads",
				pattern: /^\/uploads\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
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
