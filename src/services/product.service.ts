import axios from "axios";
import {ConfigDataDocument} from "../types/config/data";
import {
    ProductActivateParamDocument,
    ProductAddParamDocument, ProductDeleteParamDocument,
    ProductDocument,
    ProductGetParamDocument,
    ProductUpdateParamDocument
} from "../types/services/product.service";
import FormData from "form-data";

export default {
    async get(data: ConfigDataDocument, params: ProductGetParamDocument) : Promise<ProductDocument[]> {
        const url = `${data.api}/app/product/list`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.get(url, { headers, params: {...params, start: 0, length: 999999, orderColumn: 1, orderDirection: "desc", timezone: "+03:00", draw: 1}});
            return response.data;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return [];
        }
    },
    async addGroup(data: ConfigDataDocument, params: ProductAddParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/product/addToGroup`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        params.productIds.forEach((productId, index) => {
            formData.append(`productIds[${index}]`, productId);
        });

        try {
            const response = await axios.post(url, { headers, params: {productIds: "", filter: {"isLowestPrice":false}, replaceGroupIfExist: true, groupId: params.groupId}});
            return true;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    },
    async update(data: ConfigDataDocument, params: ProductUpdateParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/feed/update`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        params.productIds.forEach((productId, index) => {
            formData.append(`productIds[${index}]`, productId);
        });

        try {
            const response = await axios.post(url, { headers, params: {productIds: "", filter: {"isLowestPrice":false}}});
            return true;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    },
    async activate(data: ConfigDataDocument, params: ProductActivateParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/product/listing/activate`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        params.productIds.forEach((productId, index) => {
            formData.append(`productIds[${index}]`, productId);
        });

        try {
            const response = await axios.put(url, { headers, params: {productIds: "", filter: {"isLowestPrice":false}}});
            return true;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    },
    async delete(data: ConfigDataDocument, params: ProductDeleteParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/product/deleteAll`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        params.productIds.forEach((productId, index) => {
            formData.append(`productIds[${index}]`, productId);
        });

        try {
            const response = await axios.put(url, { headers, params: {productIds: "", filter: params.filter}});
            return true;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    }
}