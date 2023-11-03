export interface ProductDocument {
    id: number
    asin: string
}

export interface ProductGetParamDocument {
    isLowestPrice?: boolean
    profitType?: string
    maxProfit?: number
    lowestPriceDiff?: number
    lowestPriceDiffCondition?: string
}

export interface ProductAddParamDocument {
    groupId: number
    productIds: number[]
}

export interface ProductUpdateParamDocument {
    productIds: number[]
}

export interface ProductActivateParamDocument {
    productIds: number[]
}

export interface ProductDeleteParamDocument {
    productIds: number[],
    filter: ProductGetParamDocument
}