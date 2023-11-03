import fs from "fs";
import {LogAddParamDataDocument} from "../types/utils/log.util";

function checkFile(filePath: string): boolean {
    return fs.existsSync(filePath);
}

function getFileName(): boolean {
    return ;
}

export default {
    add(filePath: string, data: LogAddParamDataDocument){
        let allData = [];
        if(checkFile(filePath)){
            allData = await new Promise<SitemapDocument>(resolve => {
                fs.readFile(this.getName(lastCode, true), "utf8", (err, data) => {
                    resolve(JSON.parse(data))
                });
            });
        }
    }
}