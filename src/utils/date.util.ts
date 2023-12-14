import {ConfigDataDocument} from "../types/config/data";

export default {
    getLocalString() {
        return new Date().toLocaleString('en-US', {
            hour12: false
        });
    },
    checkForbiddenHours(data: ConfigDataDocument) {
        const localDate = this.getLocalString();
        const currentTime = new Date(localDate);

        let startForbiddenHour = data.forbiddenHours[0].split(":");
        let endForbiddenHour = data.forbiddenHours[1].split(":");

        const startTime =  new Date(new Date(localDate).setUTCHours(Number(startForbiddenHour[0]), Number(startForbiddenHour[1]), 0, 0));

        const endTime = new Date(new Date(localDate).setUTCHours(Number(endForbiddenHour[0]), Number(endForbiddenHour[1]), 0, 0));

        if (endTime < startTime) {
            endTime.addDays(1);
        }

        return currentTime >= startTime && currentTime <= endTime;
    }
}