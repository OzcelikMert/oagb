import path from "path";

export default {
    get configData() { return path.resolve(__dirname, "../../", "config", "data.json"); },
    get configAuth() { return path.resolve(__dirname, "../../", "config", "auth.json"); },
    get output() { return path.resolve(__dirname, "../../", "output"); },
}