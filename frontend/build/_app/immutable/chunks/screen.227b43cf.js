import{g as e}from"./urql-svelte.bf611f93.js";const a=e`
	fragment Screens on Query {
		screens {
			name
			params
		}
	}
`,n=e`
	mutation SaveScreens($screens: [ScreenInput!]!) {
		saveScreens(screens: $screens) {
			name
			params
		}
	}
`,r={uploads:"Bilder",calendar:"Kalender",news:"News",post:"Post",sbb:"SBB",games:"Spiele",weather:"Wetter"},t={news:{1646:"Allgemein",718:"Sport",454:"Kultur",630:"Wissen"},weather:{daily:"Täglich",hourly:"Stündlich"}};export{a as S,n as a,r as b,t as s};
