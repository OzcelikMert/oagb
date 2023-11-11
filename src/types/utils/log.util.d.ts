import {UserAccountDocument} from "../services/userAccount.service";
import {GroupDocument} from "../services/groups.service";

export interface LogDocument {
    _id: string
    isAuth: boolean
    time: string
    userAccount: UserAccountDocument
    grouping: {
        group: GroupDocument
        productCount: number
    }[]
    activatedProductCount: number
    cleaningProfit: {
        maxProfit: number
        productCount: number
    }
    cleaningProfitPercentage: {
        maxProfitPercentage: number
        productCount: number
    }
    cleaningLowestPriceDiff: {
        lowestPriceDiff: number
        productCount: number
    }
    removedAsins: string[]
}