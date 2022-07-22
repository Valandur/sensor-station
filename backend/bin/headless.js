"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const date_fns_1 = require("date-fns");
require("dotenv/config");
const weather_1 = require("./weather");
const RECORD_INTERVAL = 60 * 1000;
const main = async () => {
    // Weather
    console.log('weather...');
    const weather = new weather_1.Weather();
    await weather.init();
    await (0, promises_1.mkdir)('./data/recordings/', { recursive: true });
    const record = async () => {
        try {
            await weather.update();
            const { temp, rh } = weather.status;
            const date = new Date();
            const fileName = `./data/recordings/${(0, date_fns_1.format)(date, 'yyyy_MM')}.txt`;
            if (!(await (0, promises_1.stat)(fileName).catch(() => false))) {
                await (0, promises_1.writeFile)(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
            }
            else {
                await (0, promises_1.appendFile)(fileName, `${date.toISOString()},${temp},${rh}\n`, 'utf-8');
            }
            console.log(`Recorded temp & rh`, date, temp, rh);
        }
        catch (err) {
            console.error(err);
        }
    };
    await record();
    setInterval(record, RECORD_INTERVAL);
};
main().catch((err) => console.error(err));
