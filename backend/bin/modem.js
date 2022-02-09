"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modem = void 0;
const serial_commander_1 = __importDefault(require("@westh/serial-commander"));
const PORT = '/dev/ttyUSB2';
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
        this.commander = new serial_commander_1.default({ port: PORT });
        await this.commander.send('AT');
        this.timer = setInterval(this.update, 1000);
    }
    async dispose() {
        await this.commander.close();
        clearInterval(this.timer);
    }
    async getStatus() {
        const copsResp = await this.commander.send('AT+COPS?');
        console.log(copsResp);
        const csqResp = await this.commander.send('AT+CSQ');
        console.log(csqResp);
        const cgRegResp = await this.commander.send('AT+CGREG');
        console.log(cgRegResp);
        return { isConnected: false, network: '', signalQuality: 0 };
    }
}
exports.Modem = Modem;
