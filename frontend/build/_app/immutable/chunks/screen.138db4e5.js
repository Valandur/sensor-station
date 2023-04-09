import{g as e}from"./urql-svelte.6bc409f7.js";const n=e`
	fragment Screens on Query {
		screens {
			name
			params
		}
	}
`,a=e`
	mutation SaveScreens($screens: [ScreenInput!]!) {
		saveScreens(screens: $screens) {
			name
			params
		}
	}
`,r={uploads:"Bilder",calendar:"Kalender",news:"News",post:"Post",sbb:"SBB",games:"Spiele",weather:"Wetter"},t={news:{1646:"Allgemein",718:"Sport",454:"Kultur",630:"Wissen"},weather:{daily:"Täglich",hourly:"Stündlich",alerts:"Warnungen"}};export{n as S,a,r as b,t as s};
