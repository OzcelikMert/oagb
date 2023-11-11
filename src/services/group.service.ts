import axios from "axios";
import {ConfigDataDocument} from "../types/config/data";
import {GroupDocument} from "../types/services/groups.service";
import {ConfigAuthDocument} from "../types/config/auth";

export default {
    async get(data: ConfigDataDocument, auth: ConfigAuthDocument) : Promise<GroupDocument[]> {
        const url = `${data.api}/app/product/groups`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.get(url, {headers: headers});
            return response.data.groups;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return [];
        }
    }
}