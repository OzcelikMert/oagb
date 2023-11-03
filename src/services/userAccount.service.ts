import axios from "axios";
import FormData from "form-data";
import {ConfigDataDocument} from "../types/config/data";
import {UserAccountDocument, UserAccountPutParamDocument} from "../types/services/userAccount.service";

export default {
    async get(data: ConfigDataDocument) : Promise<false | UserAccountDocument[]> {
        const url = `${data.api}/app/user-accounts`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'application/json'
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.userAccounts.filter((userAccount: UserAccountDocument) => !data.ignoreUserAccounts.some(ignoreUserAccount => ignoreUserAccount == userAccount.id));
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    },
    async put(data: ConfigDataDocument, params: UserAccountPutParamDocument) : Promise<boolean> {
        const url = `${data.api}/app/user-accounts`;

        const headers = {
            Authorization: data.auth,
            'Content-Type': 'multipart/form-data'
        };

        const formData = new FormData();
        formData.append("userAccountId", params.userAccountId);

        try {
            const response = await axios.put(url, formData, { headers });
            return true;
        } catch (error: any) {
            console.error('Hata:', error?.message);
            return false;
        }
    }
}