import {UserAccountDocument} from "../services/userAccount.service";
import {GroupDocument} from "../services/groups.service";

export interface LogDocument {
    isAuth: boolean
    time: string
    userAccount: UserAccountDocument
    grouping: {
        group: GroupDocument
        productCount: number
    }[]
    cleaningProfit: {
        maxProfit: number
        productCount: number
    }
    cleaningLowestPriceDiff: {
        lowestPriceDiff: number
        productCount: number
    }
}