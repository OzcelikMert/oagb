import fastify from 'fastify';
import chalk from 'chalk';

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"
import fs from "fs";
import * as path from "path";
import {ConfigDataDocument} from "./types/config/data";
import userAccountService from "./services/userAccount.service";
import groupService from "./services/group.service";
import authService from "./services/auth.service";
import threadUtil from "./utils/thread.util";
import productService from "./services/product.service";
import {LogAddParamDataDocument} from "./types/utils/log.util";
import logUtil from "./utils/log.util";

console.time(`server`)
console.log(chalk.cyan(`\n=========  SERVER LOADING =========`));

const server = fastify({ trustProxy: true, logger: true, ignoreTrailingSlash: true });

const configDataPath = path.resolve(__dirname, "../", "config", "data.json");
const outputPath = path.resolve(__dirname, "../", "output");

async function startGrouping() {
    let configData = await new Promise<ConfigDataDocument>(resolve => {
        fs.readFile(configDataPath, "utf8", function (err, result) {
            resolve(JSON.parse(result))
        });
    });

    let userAccounts = await userAccountService.get(configData);
    console.log(userAccounts);
    if(userAccounts != false){
        for (const userAccount of userAccounts) {
            let logData: LogAddParamDataDocument = {
                isAuth: false,
                time: (new Date()).toUTCString(),
                userAccount: userAccount,
                grouping: [],
                cleaningLowestPriceDiff: {
                    lowestPriceDiff: configData.lowestPriceDiff,
                    productCount: 0
                },
                cleaningProfit: {
                    maxProfit: configData.maxProfit,
                    productCount: 0
                }
            };
            await userAccountService.put(configData, {userAccountId: userAccount.id});
            let refresh = await authService.postRefresh(configData, {refreshToken: configData.refreshToken});
            if(refresh != false){
                logData.isAuth = true;
                configData.auth = refresh.accessToken;
                configData.refreshToken = refresh.refreshToken;
                let groups = await groupService.get(configData);
                console.log(groups);
                let products = await productService.get(configData, {isLowestPrice: false});
                console.log(products.length);
                for(const group of groups) {
                    logData.grouping.push({group: group, productCount: products.length})
                    await productService.addGroup(configData, {productIds: products.map(product => product.id), groupId: group.id});
                    await productService.update(configData, {productIds: products.map(product => product.id)});
                    products = await productService.get(configData, {isLowestPrice: false});
                    console.log(products.length);
                }
                await productService.activate(configData, {productIds: products.map(product => product.id)});
                products = await productService.get(configData, {profitType: "amount", maxProfit: configData.maxProfit});
                logData.cleaningProfit.productCount = products.length;
                await productService.delete(configData, {productIds: products.map(product => product.id), filter: {profitType: "amount", maxProfit: configData.maxProfit}});
                products = await productService.get(configData, {lowestPriceDiffCondition: "above", lowestPriceDiff: configData.lowestPriceDiff});
                logData.cleaningLowestPriceDiff.productCount = products.length;
                await productService.delete(configData, {productIds: products.map(product => product.id), filter: {lowestPriceDiffCondition: "above", lowestPriceDiff: configData.lowestPriceDiff}});
            }
            logUtil.add(outputPath, logData);
        }
        setTimeout(() => {
            startGrouping();
        }, (configData.interval * 60 * 1000))
    }

    await new Promise(resolve => {
        fs.writeFile(configDataPath, JSON.stringify(configData), function (err) {
            resolve(0)
        })
    })
}

server.listen({port: 5001}, async () => {
    await startGrouping();
    console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
    console.timeEnd(`server`);
});


