import {ConfigDataDocument} from "../types/config/data";
import fs from "fs";
import pathUtil from "./path.util";
import {ConfigAuthDocument} from "../types/config/auth";

export default {
    async getConfigData() {
        return await new Promise<ConfigDataDocument>(resolve => {
            fs.readFile(pathUtil.configData, "utf8", function (err, result) {
                resolve(JSON.parse(result))
            });
        });
    },
    async getAuthData() {
        return await new Promise<ConfigAuthDocument>(resolve => {
            fs.readFile(pathUtil.configAuth, "utf8", function (err, result) {
                resolve(JSON.parse(result))
            });
        });
    },
    async setAuthData(auth: ConfigAuthDocument) {
        await new Promise(resolve => {
            fs.writeFile(pathUtil.configAuth, JSON.stringify(auth), function (err) {
                resolve(0)
            })
        });
    }
}