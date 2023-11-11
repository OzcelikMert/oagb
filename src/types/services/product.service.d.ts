export interface ProductDocument {
    id: number
    asin: string
    totalProfit: number
    totalPriceInSource: number
}

export interface ProductGetParamDocument {
    isLowestPrice?: boolean
    profitType?: string
    maxProfit?: number
    lowestPriceDiff?: number
    lowestPriceDiffCondition?: string
}

export interface ProductAddGroupParamDocument {
    groupId: number
    productIds: number[]
    filter: ProductGetParamDocument
}

export interface ProductUpdateParamDocument {
    productIds: number[]
    filter: ProductGetParamDocument
}

export interface ProductActivateParamDocument {
    productIds: number[]
    filter: ProductGetParamDocument
}

export interface ProductDeleteParamDocument {
    productIds: number[],
    filter: ProductGetParamDocument
}