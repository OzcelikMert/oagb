import axios from "axios";
import {ConfigDataDocument} from "../types/config/data";
import {AuthRefreshPostDocument, AuthRefreshPostParamDocument} from "../types/services/auth.service";
import {ConfigAuthDocument} from "../types/config/auth";

export default {
    async postRefresh(data: ConfigDataDocument, auth: ConfigAuthDocument, params: AuthRefreshPostParamDocument) : Promise<false | AuthRefreshPostDocument> {
        const url = `${data.api}/auth/refresh`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.post(url, params, {headers: headers});
            return response.data;
        } catch (error: any) {
            console.log(error);
            console.error('Hata:', error?.message);
            return false;
        }
    }
}