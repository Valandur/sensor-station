const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","fonts/icofont.eot","fonts/icofont.svg","fonts/icofont.ttf","fonts/icofont.woff","fonts/icofont.woff2","icofont.min.css","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".svg":"image/svg+xml",".ttf":"font/ttf",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.DkHDljxJ.js","app":"_app/immutable/entry/app.B2xjn9AG.js","imports":["_app/immutable/entry/start.DkHDljxJ.js","_app/immutable/chunks/entry.CtZelQs_.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/entry/app.B2xjn9AG.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-ZFajX0AF.js')),
			__memo(() => import('./chunks/1-BlfLQQEG.js')),
			__memo(() => import('./chunks/2-Ck1IOqrT.js')),
			__memo(() => import('./chunks/3-LAtfRmdV.js')),
			__memo(() => import('./chunks/4-eI4XhkhY.js')),
			__memo(() => import('./chunks/5-tezZVjKO.js')),
			__memo(() => import('./chunks/6-BV9wE27X.js')),
			__memo(() => import('./chunks/7-DrPuxv1l.js')),
			__memo(() => import('./chunks/8-Sj1u5bjb.js')),
			__memo(() => import('./chunks/9-B87thqDH.js')),
			__memo(() => import('./chunks/10-C8654_n3.js')),
			__memo(() => import('./chunks/11-BFYQgJd_.js')),
			__memo(() => import('./chunks/12-I1KcchSS.js')),
			__memo(() => import('./chunks/13-DYyhw6yC.js')),
			__memo(() => import('./chunks/14-DOVu6CEl.js')),
			__memo(() => import('./chunks/15-DgfuvQQs.js')),
			__memo(() => import('./chunks/16-Dv7CBGJS.js')),
			__memo(() => import('./chunks/17-CmWVZ50u.js')),
			__memo(() => import('./chunks/18-Bg2SlPD8.js')),
			__memo(() => import('./chunks/19-BabxF0XU.js')),
			__memo(() => import('./chunks/20-DyliTZv5.js')),
			__memo(() => import('./chunks/21-Me4xrTrl.js')),
			__memo(() => import('./chunks/22-D0pfwePx.js')),
			__memo(() => import('./chunks/23-w3Nd00eV.js'))
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
				id: "/screens/printer",
				pattern: /^\/screens\/printer\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/screens/sbb/alerts",
				pattern: /^\/screens\/sbb\/alerts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/screens/sbb/departures",
				pattern: /^\/screens\/sbb\/departures\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/screens/tuya",
				pattern: /^\/screens\/tuya\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/screens/uploads",
				pattern: /^\/screens\/uploads\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/screens/weather/alerts",
				pattern: /^\/screens\/weather\/alerts\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/screens/weather/daily",
				pattern: /^\/screens\/weather\/daily\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/screens/weather/hourly",
				pattern: /^\/screens\/weather\/hourly\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/uploads",
				pattern: /^\/uploads\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
