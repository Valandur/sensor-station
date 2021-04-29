import { Display } from './display';
import { News } from './news';
import { Printer } from './printer';
import { Reddit } from './reddit';
import { Weather } from './weather';

process.env['DISPLAY'] = ':0';

const WIDTH = 800;
const HEIGHT = 480;

// --------------
// Display
// --------------
console.log('display...');
const display = new Display(WIDTH, HEIGHT);

// --------------
// Weather
// --------------
console.log('weather...');
new Weather('weather', display);

// --------------
// News
// --------------
console.log('news...');
new News('news-general', 'https://www.srf.ch/news/bnf/rss/1646', display);
new News('news-sports', 'https://www.srf.ch/sport/bnf/rss/718', display);

// --------------
// Reddit
// --------------
console.log('reddit...');
new Reddit('reddit-earthporn', 'https://www.reddit.com/r/EarthPorn/hot/.rss', display);

// --------------
// Printer
// --------------
console.log('printer...');
new Printer('printer', display);

// --------------
// Main run loop
// --------------

process.on('SIGINT', () => (display.shouldExit = true));

display
	.run()
	.catch((err) => console.error(err))
	.finally(() => process.exit(0));
