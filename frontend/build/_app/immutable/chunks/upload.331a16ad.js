import{g as t}from"./urql-svelte.e148a647.js";const e=t`
	query GetUploads {
		uploads {
			items {
				ts
				title
				img
				ratio
			}
		}
	}
`,a=t`
	mutation SaveUpload($img: String!, $ts: String!, $title: String!) {
		saveUpload(img: $img, ts: $ts, title: $title) {
			ts
			title
			img
			ratio
		}
	}
`,o=t`
	mutation DeleteUpload($img: String!) {
		deleteUpload(img: $img) {
			ts
			title
			img
			ratio
		}
	}
`;export{o as D,e as G,a as S};
