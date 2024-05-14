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
		client: {"start":"_app/immutable/entry/start.CTjyoVEa.js","app":"_app/immutable/entry/app.CFAjSiJo.js","imports":["_app/immutable/entry/start.CTjyoVEa.js","_app/immutable/chunks/entry.uLdcenjk.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DknyqqiT.js","_app/immutable/entry/app.CFAjSiJo.js","_app/immutable/chunks/4.DvpUlx_Z.js","_app/immutable/chunks/index.DCj8BktF.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-ZFajX0AF.js')),
			__memo(() => import('./chunks/1-QllDMv4_.js')),
			__memo(() => import('./chunks/2-BebZDCPm.js')),
			__memo(() => import('./chunks/3-BZzjnqsG.js')),
			__memo(() => import('./chunks/4-eI4XhkhY.js')),
			__memo(() => import('./chunks/5-C2lFD12r.js')),
			__memo(() => import('./chunks/6-Qai1Jeyh.js')),
			__memo(() => import('./chunks/7-BT-Ak_-E.js')),
			__memo(() => import('./chunks/8-Sj1u5bjb.js')),
			__memo(() => import('./chunks/9-ZPv_5PN4.js')),
			__memo(() => import('./chunks/10-gfpRKkV4.js')),
			__memo(() => import('./chunks/11-CsGDDrnN.js')),
			__memo(() => import('./chunks/12-I1KcchSS.js')),
			__memo(() => import('./chunks/13-Cc7xMP5R.js')),
			__memo(() => import('./chunks/14-DZf0_Afz.js')),
			__memo(() => import('./chunks/15-BMBN93FG.js')),
			__memo(() => import('./chunks/16-CyqBxoSK.js')),
			__memo(() => import('./chunks/17-tvDQ2wwD.js')),
			__memo(() => import('./chunks/18-BcrhmWky.js')),
			__memo(() => import('./chunks/19-BbClYn-j.js')),
			__memo(() => import('./chunks/20-DVIlyL26.js')),
			__memo(() => import('./chunks/21-BWzn7BEk.js')),
			__memo(() => import('./chunks/22-DctX9K_i.js')),
			__memo(() => import('./chunks/23-DSoXcoSR.js'))
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
