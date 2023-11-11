import axios from "axios";
import FormData from "form-data";
import {ConfigDataDocument} from "../types/config/data";
import {UserAccountDocument, UserAccountPutParamDocument} from "../types/services/userAccount.service";
import {ConfigAuthDocument} from "../types/config/auth";

export default {
    async get(data: ConfigDataDocument, auth: ConfigAuthDocument) : Promise<false | UserAccountDocument[]> {
        const url = `${data.api}/app/user-accounts`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.get(url, {headers: headers});
            return response.data.userAccounts.filter((userAccount: UserAccountDocument) => data.userAccounts.some(configUserAccount => configUserAccount == userAccount.id));
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    },
    async put(data: ConfigDataDocument, auth: ConfigAuthDocument, params: UserAccountPutParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/user-accounts`;

        const headers = {
            Authorization: auth.accessToken,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        formData.append("userAccountId", params.userAccountId);

        try {
            const response = await axios.put(url, formData, {headers: headers});
            return true;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    }
}