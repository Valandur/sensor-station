import{g as t}from"./urql-svelte.2b4923b5.js";const e=t`
	fragment UploadItems on Query {
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
`;export{o as D,a as S,e as U};
