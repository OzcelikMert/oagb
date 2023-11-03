import {DateMask} from "./date";
import string from "./string";
const { createHash } = require('crypto');

enum FilterTypes {
    EMAIL,
    INT,
    FLOAT
}

class Variable{
    static clearAllScriptTags<T>(data: any, expectKeys?: string[]): T {
        for (let key in data) {
            if (expectKeys && expectKeys.includes(key)) continue;

            let value = data[key];
            if(typeof value === "object"){
                value = this.clearAllScriptTags(value);
            } else if(typeof value === "string"){
                value = value.removeScriptTags();
            }

            data[key] = value;
        }
        return data;
    }
    static isSet(...variable: any) : boolean{
        let result;
        try{
            for (let i = 0; i < variable.length; i++){
                result = variable[i]();
            }
        }catch (e){
            result = undefined;
        }finally {
            return result !== undefined;
        }
    }
    static isEmpty(...variable: any) : boolean{
        for (let i = 0; i < variable.length; i++){
            if(
                !this.isSet(() => variable[i]) ||
                variable[i] === null ||
                variable[i].length === 0 ||
                (typeof variable[i] === string && !variable[i].toString().trim())
            ) return true;
        }
        return false;
    }
    static isNull(...variable: any){
        for (let i = 0; i < variable.length; i++){
            if(variable[i] !== null) return false;
        }
        return true;
    }
    static isNotNull(...variable: any){
        return !Variable.isNull(variable);
    }
    static setDefault(variable: any, default_value: any) : any{
        return (this.isSet(variable)) ? variable() : default_value;
    }
    static hash(string: string, hashType: string): string { return createHash("sha256").update(string).digest("hex"); }
    private static filterVar(variable: any, filter_type: FilterTypes) : string {
        let regex;

        // Check Filter Type
        switch(filter_type){
            case FilterTypes.EMAIL:
                regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
                break;
            case FilterTypes.INT:
                regex = /([0-9]+)/g;
                break;
            case FilterTypes.FLOAT:
                regex = /[+-]?([0-9]*[.])[0-9]+/g;
        }
        // Check Defined
        let match;
        if ((match = regex.exec(variable)) != null) {
            variable = match[0];
        } else {
            variable = "";
        }

        return variable;
    }
}

export {
    DateMask,
    FilterTypes
}

export default Variable;




