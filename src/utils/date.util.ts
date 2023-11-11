import {ConfigDataDocument} from "../types/config/data";
import chalk from "chalk";

export default {
    getLocalString() {
        const options = { timeZone: 'Europe/Istanbul' };
        return new Date().toLocaleString('tr-TR', options);
    },
    checkForbiddenHours(data: ConfigDataDocument) {
        const localDate = this.getLocalString();
        const currentTime = new Date(localDate);
        let startForbiddenHour = data.forbiddenHours[0].split(":");
        const startTime = new Date(localDate);
        startTime.setHours(Number(startForbiddenHour[0]), Number(startForbiddenHour[1]), 0, 0);
        let endForbiddenHour = data.forbiddenHours[1].split(":");
        const endTime = new Date(localDate);
        endTime.setHours(Number(endForbiddenHour[0]), Number(endForbiddenHour[1]), 0, 0);

        if (endForbiddenHour[0] < startForbiddenHour[0]) {
            endTime.setDate(endTime.getDate() + 1);
        }

        return currentTime >= startTime && currentTime <= endTime;
    }
}