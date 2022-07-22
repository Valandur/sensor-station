"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
require("dotenv/config");
const weather_1 = require("./weather");
const RECORD_INTERVAL = 60000;
const main = async () => {
    // Weather
    console.log('weather...');
    const weather = new weather_1.Weather();
    await weather.init();
    await (0, promises_1.mkdir)('./data/', { recursive: true });
    if (!(await (0, promises_1.stat)('./data/recordings.txt').catch(() => false))) {
        await (0, promises_1.writeFile)('./data/recordings.txt', '', 'utf-8');
    }
    const record = async () => {
        try {
            const { temp, rh } = weather.status;
            const date = new Date().toISOString();
            await (0, promises_1.appendFile)('./data/recordings.txt', `${date},${temp},${rh}`, 'utf-8');
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
