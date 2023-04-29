import superagent from 'superagent';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const link = Buffer.from(params.article, 'base64url').toString('utf-8');

	const { text } = await superagent.get(link);
	const page = text;

	const headStart = page.indexOf('<head>') + 6;
	const headEnd = page.indexOf('</head>', headStart);
	const head = page.substring(headStart, headEnd);

	const mainStart = page.indexOf('<main');
	const mainEnd = page.indexOf('</main>', mainStart) + 7;
	const main = page.substring(mainStart, mainEnd);

	const scriptStart = page.lastIndexOf('<span id="config__js"');
	const scriptEnd = page.indexOf('</body>', scriptStart);
	const scripts = page.substring(scriptStart, scriptEnd);

	return {
		head,
		main,
		scripts
	};
};
