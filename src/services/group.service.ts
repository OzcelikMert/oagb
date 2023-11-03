import axios from "axios";
import {ConfigDataDocument} from "../types/config/data";
import {GroupDocument} from "../types/services/groups.service";

export default {
    async get(data: ConfigDataDocument) : Promise<GroupDocument[]> {
        const url = `${data.api}/app/product/groups`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.groups;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return [];
        }
    }
}