const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","fonts/icofont.eot","fonts/icofont.svg","fonts/icofont.ttf","fonts/icofont.woff","fonts/icofont.woff2","icofont.min.css","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".svg":"image/svg+xml",".ttf":"font/ttf",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.CROVWF3C.js","app":"_app/immutable/entry/app.DpSKjdEb.js","imports":["_app/immutable/entry/start.CROVWF3C.js","_app/immutable/chunks/entry.CAz5lSiv.js","_app/immutable/chunks/3.CIpb_NnJ.js","_app/immutable/entry/app.DpSKjdEb.js","_app/immutable/chunks/3.CIpb_NnJ.js","_app/immutable/chunks/index.wuN5Iy8Q.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-DQDnuNZq.js')),
			__memo(() => import('./chunks/1-CMvu80dg.js')),
			__memo(() => import('./chunks/2-BowKTKiM.js')),
			__memo(() => import('./chunks/3-BeZV7ub8.js')),
			__memo(() => import('./chunks/4-CdoQgBf_.js')),
			__memo(() => import('./chunks/5-ydVn7ed4.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/services",
				pattern: /^\/services\/?$/,
				params: [],
				page: { layouts: [0,,], errors: [1,2,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/services/[name]/[...action]",
				pattern: /^\/services\/([^/]+?)(?:\/(.*))?\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false},{"name":"action","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,,], errors: [1,2,], leaf: 5 },
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
