const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","fonts/chakra-petch-v9-latin_latin-ext-300.woff","fonts/chakra-petch-v9-latin_latin-ext-300.woff2","fonts/chakra-petch-v9-latin_latin-ext-500.woff","fonts/chakra-petch-v9-latin_latin-ext-500.woff2","fonts/chakra-petch-v9-latin_latin-ext-regular.woff","fonts/chakra-petch-v9-latin_latin-ext-regular.woff2","icons/clear.png","icons/clouds.png","icons/drizzle.png","icons/foggy.png","icons/heavyrain.png","icons/heavysnow.png","icons/overcast.png","icons/rain.png","icons/sand.png","icons/sandstorm.png","icons/snow.png","icons/thunderstorm.png","icons/tornado.png","icons/wind.png","img/cover/cover-2-dark.jpg","img/cover/cover-2.jpg","img/cover/cover-3-dark.jpg","img/cover/cover-3.jpg","img/cover/cover-4-dark.jpg","img/cover/cover-4.jpg","img/cover/cover-5-dark.jpg","img/cover/cover-5.jpg","img/cover/cover-6-dark.jpg","img/cover/cover-6.jpg","img/cover/cover-7-dark.jpg","img/cover/cover-7.jpg","img/cover/cover-8-dark.jpg","img/cover/cover-8.jpg","img/cover/cover-9-dark.jpg","img/cover/cover-9.jpg","img/cover/cover-dark.jpg","img/cover/cover-thumb-1.jpg","img/cover/cover-thumb-2.jpg","img/cover/cover-thumb-3.jpg","img/cover/cover-thumb-4.jpg","img/cover/cover-thumb-5.jpg","img/cover/cover-thumb-6.jpg","img/cover/cover-thumb-7.jpg","img/cover/cover-thumb-8.jpg","img/cover/cover-thumb-9.jpg","img/cover/cover.jpg","img/logo/logo-dark.png","img/logo/logo.png","img/mode/dark.jpg","img/mode/light.jpg","img/pattern/pattern-dark.png","img/pattern/pattern.png"]),
	mimeTypes: {".png":"image/png",".woff":"font/woff",".woff2":"font/woff2",".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.BQL2Ocjj.js",app:"_app/immutable/entry/app.D2qkGD65.js",imports:["_app/immutable/entry/start.BQL2Ocjj.js","_app/immutable/chunks/NXOOxNA3.js","_app/immutable/chunks/BHCLn_Xu.js","_app/immutable/entry/app.D2qkGD65.js","_app/immutable/chunks/jKjWACjA.js","_app/immutable/chunks/BHCLn_Xu.js","_app/immutable/chunks/IHki7fMi.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-AQXKmdvz.js')),
			__memo(() => import('./chunks/1-zEYEGi44.js')),
			__memo(() => import('./chunks/2-DtDpfDuM.js')),
			__memo(() => import('./chunks/3-CeV-2sKr.js')),
			__memo(() => import('./chunks/4-iuRc1AqX.js')),
			__memo(() => import('./chunks/5-C6TUnUca.js'))
		],
		remotes: {
			
		},
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
				pattern: /^\/services\/([^/]+?)(?:\/([^]*))?\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false},{"name":"action","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,,], errors: [1,2,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
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
