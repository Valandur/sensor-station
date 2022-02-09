"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modem = void 0;
const serial_commander_1 = __importDefault(require("@westh/serial-commander"));
const PORT = '/dev/ttyUSB2';
const UPDATE_INTERVAL = 10 * 1000;
class Modem {
    constructor() {
        this.update = async () => {
            try {
                this.status = await this.getStatus();
            }
            catch (err) {
                console.error(err);
            }
        };
    }
    async init() {
        this.commander = new serial_commander_1.default({ port: PORT, disableLog: true });
        await this.commander.send('AT');
        this.timer = setInterval(this.update, UPDATE_INTERVAL);
    }
    async dispose() {
        await this.commander.close();
        clearInterval(this.timer);
    }
    async getStatus() {
        await this.commander.send('AT+COPS=3,0');
        const { response: copsResp } = await this.commander.send('AT+COPS?');
        console.log(copsResp.split('\r').filter((l) => l.startsWith('COPS:')));
        const { response: csqResp } = await this.commander.send('AT+CSQ');
        console.log(csqResp);
        await this.commander.send('AT+CGREG=2');
        const { response: cgRegResp } = await this.commander.send('AT+CGREG');
        console.log(cgRegResp);
        return { isConnected: false, network: '', signalQuality: 0 };
    }
}
exports.Modem = Modem;
