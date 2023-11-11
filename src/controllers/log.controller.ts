import {FastifyRequest, FastifyReply} from 'fastify';
import pathUtil from "../utils/path.util";
import htmlUtil from "../utils/html.util";
import {LogDocument} from "../types/utils/log.util";
import path from "path";
import fileUtil from "../utils/file.util";
import dateUtil from "../utils/date.util";

const fs = require('fs');

export default {
    async getAllLogs(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        let configData = await fileUtil.getConfigData();

        let logFiles = await new Promise<string[]>(resolve => {
            fs.readdir(pathUtil.output, (err: any, allFiles: string[]) => {
                resolve(allFiles ?? []);
            });
        });

        logFiles = logFiles.sort((file1, file2) => {
            const date1 = file1.split('.')[0];
            const date2 = file2.split('.')[0];

            const date1Fixed = date1.split('-').reverse().join('-');
            const date2Fixed = date2.split('-').reverse().join('-');

            return date1Fixed.localeCompare(date2Fixed);
        }).reverse();

        reply.header('Content-Type', 'text/html').code(200).send(htmlUtil.getPage({
            titleTag: "All Logs",
            style: `
                h3.forbidden-hours {
                    color: red;
                    text-align: center;
                }
            `,
            body: `
                <div>
                    ${dateUtil.checkForbiddenHours(configData) ? `<h3 class="forbidden-hours">Forbidden Hours ${configData.forbiddenHours[0]} - ${configData.forbiddenHours[1]}</h3>` : ``}
                    <h1>List of Log Files</h1>
                    <h4>(Year - Day - Month)</h4>
                </div>
                <ul>
                    ${logFiles.map(logFile => `
                        <li>
                            <h3><a href="${logFile.replace(".json", "")}">${logFile.replace(".json", "")}</a></h3>
                        </li>`
                    ).join("")}
                </ul>
            `
        }));
    },
    async getLog(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        const params = req.params as { fileName: string };
        const fileName = params.fileName ?? "";
        let filePathWithName = path.resolve(pathUtil.output, `${fileName}.json`);
        let logs = await new Promise<LogDocument[]>(resolve => {
            fs.readFile(filePathWithName, "utf8", (err: any, result: string) => {
                resolve(JSON.parse(result ?? "[]"))
            });
        });

        logs = logs.reverse();

        reply.header('Content-Type', 'text/html').code(200).send(htmlUtil.getPage({
            titleTag: fileName,
            style: `
                .container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .head {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .head h3 {
                    margin-bottom: 0;
                }
    
                .field {
                    border: 1px solid #ddd;
                    margin: 10px;
                    padding: 10px;
                    width: 350px;
                }
            
                .field div {
                    display: flex;
                    justify-content: space-between;
                    padding: 2px 0;
                }
                
                .field .sub-field {
                    padding-left: 50px;
                    flex-direction: column;
                }
                
                .field .sub-field .group-item {
                    margin: 2px 0;
                    flex-direction: column;
                }
                
                .field .asin-link {
                    justify-content: right;
                }
            `,
            body: `
                <div class="head">
                    <h3><a href="/" >Return Home</a></h3>
                    <h1>Log Detail: ${fileName}</h1>
                </div>
                <div class="container">
                    ${logs.map(log => `
                        <div class="field">
                            <div><strong>Market Place Name:</strong> ${log.userAccount.marketplaceName} (${log.userAccount.countryCode})</div>
                            <div><strong>Is Auth:</strong> <span style="color: ${log.isAuth ? "green" : "red"}">${log.isAuth ? "Yes" : "No"}</span></div>
                            <div><strong>Time:</strong> ${log.time}</div>
                            <div><strong>User Account ID:</strong> ${log.userAccount.id}</div>
                            <div><strong>User Account Status:</strong> <span style="color: ${log.isAuth ? "green" : "red"}">${log.isAuth ? "On" : "Off"}</span></div>
                            <div><strong>Groups</strong></div>
                            <div class="sub-field">
                                ${log.grouping.map(logGroup => `
                                    <div class="group-item">
                                        <div><strong>Group Name:</strong> ${logGroup.group.name}</div>
                                        <div><strong>Product Count:</strong> ${logGroup.productCount}</div>
                                    </div>
                                `).join("")}
                            </div>
                            <div><strong>Actived Product Count:</strong> ${log.activatedProductCount}</div>
                            <div><strong>Filter (Max Profit)</strong></div>
                            <div class="sub-field">
                                <div><strong>Max Profit:</strong> ${log.cleaningProfit.maxProfit}$</div>
                                <div><strong>Product Count:</strong> ${log.cleaningProfit.productCount}</div>
                            </div>
                            <div><strong>Filter (Max Profit Percentage)</strong></div>
                            <div class="sub-field">
                                <div><strong>Max Profit Percentage:</strong> ${log.cleaningProfitPercentage.maxProfitPercentage}%</div>
                                <div><strong>Product Count:</strong> ${log.cleaningProfitPercentage.productCount}</div>
                            </div>
                            <div><strong>Filter (Lowest Price Diff)</strong></div>
                            <div class="sub-field">
                                <div><strong>Lowest Price Diff:</strong> ${log.cleaningLowestPriceDiff.lowestPriceDiff}%</div>
                                <div><strong>Product Count:</strong> ${log.cleaningLowestPriceDiff.productCount}</div>
                            </div>
                            <div class="asin-link">
                                <h3><a href="asin/${fileName}/${log._id}">Removed Asin List</a> (${log.removedAsins.length})</h3>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `
        }));
    },
    async getAsinList(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        const params = req.params as { fileName: string, logId: string };
        const fileName = params.fileName ?? "";
        let filePathWithName = path.resolve(pathUtil.output, `${fileName}.json`);
        let logs = await new Promise<LogDocument[]>(resolve => {
            fs.readFile(filePathWithName, "utf8", (err: any, result: string) => {
                resolve(JSON.parse(result ?? "[]"))
            });
        });

        let log = logs.filter(log => log._id == params.logId)[0];

        reply.header('Content-Type', 'text/html').code(200).send(htmlUtil.getPage({
            titleTag: `${fileName} Asin List - ${log.userAccount.countryCode}`,
            style: `
                h3 {
                    margin-bottom: 0;
                }
            `,
            body: `
                <div>
                    <h3 class="text-center"><a href="/${fileName}">Return Back</a></h3>
                    <h1 class="text-center">${fileName} Asin List (${log.userAccount.countryCode})</h1>
                </div>
                ${log.removedAsins.map(removedAsin => `<p>${removedAsin}</p>`).join("")}
            `
        }));
    }
}