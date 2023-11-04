import fs from "fs";
import {LogDocument} from "../types/utils/log.util";
import {DateMask} from "../library/variable";
import * as path from "path";
import dateUtil from "./date.util";
import pathUtil from "./path.util";

export async function checkLogFile(filePath: string): Promise<boolean> {
    await createFolder();
    return fs.existsSync(filePath);
}

function getFileName(): string {
    return `${(new Date(dateUtil.getLocalString())).getStringWithMask(DateMask.DATE)}.json`;
}

async function createFolder() {
    await new Promise(resolve => {
        fs.mkdir(pathUtil.output, { recursive: true }, (err) => {
            resolve(0);
        });
    });

}

export default {
    async add(data: LogDocument){
        let allData: LogDocument[] = [];
        let filePathWithName = path.resolve(pathUtil.output, getFileName());
        if(await checkLogFile(filePathWithName)){
            allData = await new Promise<LogDocument[]>(resolve => {
                fs.readFile(filePathWithName, "utf8", (err, result) => {
                    resolve(JSON.parse(result))
                });
            });
        }
        allData.push(data);
        await new Promise(resolve => {
            fs.writeFile(filePathWithName, JSON.stringify(allData), function (err) {
                resolve(0)
            })
        })
    },
    async get(fileName: string){
        let allData: LogDocument[] = [];
        let filePathWithName = path.resolve(pathUtil.output, fileName);
        if(await checkLogFile(filePathWithName)){
            allData = await new Promise<LogDocument[]>(resolve => {
                fs.readFile(filePathWithName, "utf8", (err, data) => {
                    resolve(JSON.parse(data))
                });
            });
        }
        return allData;
    }
}