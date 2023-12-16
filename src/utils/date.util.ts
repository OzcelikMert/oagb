import {ConfigDataDocument} from "../types/config/data";

export default {
    getLocalString() {
        return new Date().toLocaleString("en-US", {
            hour12: false
        }).replace(", 24:", ", 00:");
    },
    checkForbiddenHours(data: ConfigDataDocument) {
        const localDate = this.getLocalString();

        const currentTime = new Date(localDate);
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        let startForbiddenHour = data.forbiddenHours[0].split(":");
        const startHours = Number(startForbiddenHour[0]);
        const startMinutes = Number(startForbiddenHour[1]);

        let endForbiddenHour = data.forbiddenHours[1].split(":");
        const endHours = Number(endForbiddenHour[0]);
        const endMinutes = Number(endForbiddenHour[1]);

        return (currentHours > startHours || (currentHours == startHours && currentMinutes >= startMinutes)) ||
            (currentHours < endHours || (currentHours == endHours && currentMinutes < endMinutes));
    }
}