import fastify from 'fastify';
import chalk from 'chalk';
import {v4 as uuidv4} from 'uuid';

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"
import userAccountService from "./services/userAccount.service";
import groupService from "./services/group.service";
import authService from "./services/auth.service";
import productService from "./services/product.service";
import {LogDocument} from "./types/utils/log.util";
import logUtil from "./utils/log.util";
import dateUtil from "./utils/date.util";
import routers from "./routers";
import fileUtil from "./utils/file.util";

console.time(`server`)
console.log(chalk.cyan(`\n=========  SERVER LOADING =========`));

const server = fastify({trustProxy: true, logger: true, ignoreTrailingSlash: true});

async function startGrouping() {
    const localDate = dateUtil.getLocalString();

    if (!(await refreshSession())) {
        console.log(chalk.red(`------------ ${localDate} - Session couldn't refresh ------------`));
        return;
    }

    let configData = await fileUtil.getConfigData();
    let configAuth = await fileUtil.getAuthData();

    if (dateUtil.checkForbiddenHours(configData)) {
        console.log(chalk.red(`------------ ${localDate} - Forbidden Hours ------------`));
    } else {
        console.log(chalk.cyan(`------------ ${localDate} - Group Start ------------`));
        console.time(`group`)
        let userAccounts = await userAccountService.get(configData, configAuth);
        if (userAccounts != false) {
            console.log(chalk.green(`Auth is successful`));
            for (const userAccount of userAccounts) {
                let logData: LogDocument = {
                    _id: uuidv4(),
                    isAuth: false,
                    time: dateUtil.getLocalString(),
                    userAccount: userAccount,
                    grouping: [],
                    activatedProductCount: 0,
                    cleaningLowestPriceDiff: {
                        lowestPriceDiff: configData.lowestPriceDiff,
                        productCount: 0
                    },
                    cleaningProfit: {
                        maxProfit: configData.maxProfit,
                        productCount: 0
                    },
                    cleaningProfitPercentage: {
                        maxProfitPercentage: configData.percentageProfit,
                        productCount: 0
                    },
                    removedAsins: []
                };
                await userAccountService.put(configData, configAuth, {userAccountId: userAccount.id});
                let refresh = await authService.postRefresh(configData, configAuth, {refreshToken: configAuth.refreshToken});
                if (refresh != false) {
                    logData.isAuth = true;
                    configAuth.accessToken = refresh.accessToken;
                    configAuth.refreshToken = refresh.refreshToken;
                    console.log(chalk.cyan(`- ${userAccount.countryCode}`));
                    let groups = await groupService.get(configData, configAuth);
                    let products = await productService.get(configData, configAuth, {isLowestPrice: false});
                    for (const group of groups) {
                        if(
                            configData.groupNames.length > 0 &&
                            !configData.groupNames.some(groupName => groupName.toString().trim().toLowerCase() == group.name.toString().trim().toLowerCase())
                        ) { continue; }
                        let productCount = products.length ?? 0;
                        if (productCount > 0) {
                            await productService.addGroup(configData, configAuth, {
                                productIds: products.map(product => product.id),
                                groupId: group.id,
                                filter: {isLowestPrice: false}
                            });
                            await productService.update(configData, configAuth, {
                                productIds: products.map(product => product.id),
                                filter: {isLowestPrice: false}
                            });
                            logData.grouping.push({group: group, productCount: productCount})
                            console.log(`- ${chalk.green(`Grouped and updated ${productCount} products to ${group.name}`)}`);
                        }
                        products = await productService.get(configData, configAuth, {isLowestPrice: false});
                    }
                    logData.activatedProductCount = products.length ?? 0;
                    if (logData.activatedProductCount > 0) {
                       await productService.activate(configData, configAuth, {
                            productIds: products.map(product => product.id),
                            filter: {isLowestPrice: false}
                        });
                        console.log(`- ${chalk.green(`Activated ${logData.activatedProductCount} products`)}`);
                    }
                    products = await productService.get(configData, configAuth, {
                        profitType: "amount",
                        maxProfit: configData.maxProfit
                    });
                    products = products.filter(product => ((product.totalProfit / product.totalPriceInSource) * 100) < configData.maxProfitTotalProfitPercent);
                    logData.cleaningProfit.productCount = products.length ?? 0;
                    logData.removedAsins.push(...products.map(product => product.asin));
                    if (logData.cleaningProfit.productCount > 0) {
                        //await productService.delete(configData, configAuth, {productIds: products.map(product => product.id), filter: {profitType: "amount", maxProfit: configData.maxProfit}});
                        console.log(`- ${chalk.red(`Deleted`)} ${chalk.green(`${logData.cleaningProfit.productCount} products to amount profit`)}`);
                    }
                    products = await productService.get(configData, configAuth, {
                        profitType: "percentage",
                        maxProfit: configData.percentageProfit
                    });
                    logData.cleaningProfitPercentage.productCount = products.length ?? 0;
                    logData.removedAsins.push(...products.map(product => product.asin));
                    if (logData.cleaningProfitPercentage.productCount > 0) {
                        //await productService.delete(configData, configAuth, {productIds: products.map(product => product.id), filter: {profitType: "percentage", maxProfit: configData.percentageProfit}});
                        console.log(`- ${chalk.red(`Deleted`)} ${chalk.green(`${logData.cleaningProfitPercentage.productCount} products to percentage profit`)}`);
                    }
                    products = await productService.get(configData, configAuth, {
                        lowestPriceDiffCondition: "above",
                        lowestPriceDiff: configData.lowestPriceDiff
                    });
                    logData.cleaningLowestPriceDiff.productCount = products.length ?? 0;
                    logData.removedAsins.push(...products.map(product => product.asin));
                    if (logData.cleaningLowestPriceDiff.productCount > 0) {
                        //await productService.delete(configData, configAuth, {productIds: products.map(product => product.id), filter: {lowestPriceDiffCondition: "above", lowestPriceDiff: configData.lowestPriceDiff}});
                        console.log(`- ${chalk.red(`Deleted`)} ${chalk.green(`${logData.cleaningLowestPriceDiff.productCount} products to percentage lowest price diff`)}`);
                    }
                }
                await logUtil.add(logData);
            }
            await fileUtil.setAuthData(configAuth);
        } else {
            console.log(chalk.red(`Auth has error`));
        }
        console.timeEnd(`group`);
        console.log(chalk.cyan(`------------ ${localDate} - Group End ------------`));
    }

    setTimeout(() => {
        startGrouping();
    }, (configData.interval * 60 * 1000));
}

async function refreshSession() {
    let configData = await fileUtil.getConfigData();
    let configAuth = await fileUtil.getAuthData();

    let refresh = await authService.postRefresh(configData, configAuth, {refreshToken: configAuth.refreshToken});
    if (refresh != false) {
        configAuth.accessToken = refresh.accessToken ?? "";
        configAuth.refreshToken = refresh.refreshToken ?? "";

        await fileUtil.setAuthData(configAuth);
        return true;
    }
    return false;
}

server.register(routers);

server.listen({port: 5001}, async () => {
    console.log(chalk.cyan(`=========  SERVER STARTED =========\n`));
    console.timeEnd(`server`);

    let configData = await fileUtil.getConfigData();

    if(configData.startWithGrouping == true){
        await startGrouping();
    }
    setTimeout(async () => {
        await startGrouping();
    }, (configData.interval * 60 * 1000));
});


