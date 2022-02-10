"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNight = void 0;
function isNight(date) {
    const d = date || new Date();
    const hours = d.getHours();
    return hours > 20 || hours < 6;
}
exports.isNight = isNight;
