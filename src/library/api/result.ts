import ErrorCodes from "./errorCodes";

class Result {
    constructor(
        data: any = [],
        customData: any = null,
        status: boolean = true,
        message: any = "",
        errorCode: number = ErrorCodes.success,
        statusCode: number = 200,
        source: string = ""
    ) {
        this.data = data;
        this.customData = customData;
        this.status = status;
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.source = source;
    }

    data: any;
    customData: any;
    status: boolean;
    message: any;
    errorCode: number;
    statusCode: number;
    source: string;
}

export default Result;