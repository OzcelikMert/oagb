import axios from "axios";
import {ConfigDataDocument} from "../types/config/data";
import {
    ProductActivateParamDocument, ProductAddGroupParamDocument,
    ProductDeleteParamDocument,
    ProductDocument,
    ProductGetParamDocument,
    ProductUpdateParamDocument
} from "../types/services/product.service";
import {ConfigAuthDocument} from "../types/config/auth";

export default {
    async get(data: ConfigDataDocument, auth: ConfigAuthDocument, params: ProductGetParamDocument) : Promise<ProductDocument[]> {
        const url = `${data.api}/app/product/list`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.get(url, { headers: headers, params: {...params, start: 0, length: 999999, orderColumn: 1, orderDirection: "desc", timezone: "+03:00", draw: 1}});
            return response.data.data;
        } catch (error: any) {
            console.error('product get Hata:', error?.message);
            return [];
        }
    },
    async addGroup(data: ConfigDataDocument, auth: ConfigAuthDocument, params: ProductAddGroupParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/product/addToGroup`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(url, {}, {headers: headers, params: {productIds: "", filter: JSON.stringify(params.filter), replaceGroupIfExist: true, groupId: params.groupId}});
            return true;
        } catch (error: any) {
            console.error('product addGroup Hata:', error?.message);
            return false;
        }
    },
    async update(data: ConfigDataDocument, auth: ConfigAuthDocument, params: ProductUpdateParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/feed/update`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(url, {}, {headers: headers, params: {productIds: "", filter: JSON.stringify(params.filter)}});
            return true;
        } catch (error: any) {
            console.error('product update Hata:', error?.message);
            return false;
        }
    },
    async activate(data: ConfigDataDocument, auth: ConfigAuthDocument, params: ProductActivateParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/product/listing/activate`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.put(url, {}, {headers: headers, params: {productIds: "", filter: JSON.stringify(params.filter)}});
            return true;
        } catch (error: any) {
            console.error('product activate Hata:', error?.message);
            return false;
        }
    },
    async delete(data: ConfigDataDocument, auth: ConfigAuthDocument, params: ProductDeleteParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/product/deleteAll`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(url, {}, {headers: headers, params: {productIds: params.productIds.map(productId => productId).join(","), filter: JSON.stringify(params.filter)}});
            return true;
        } catch (error: any) {
            console.error('product delete Hata:', error?.message);
            return false;
        }
    }
}