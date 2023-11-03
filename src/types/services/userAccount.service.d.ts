export interface UserAccountDocument {
    id: number
    storeNickname: string
    marketplaceId: number
    marketplaceName: string
    countryCode: string
    status: number
}

export interface UserAccountPutParamDocument {
    userAccountId: number
}