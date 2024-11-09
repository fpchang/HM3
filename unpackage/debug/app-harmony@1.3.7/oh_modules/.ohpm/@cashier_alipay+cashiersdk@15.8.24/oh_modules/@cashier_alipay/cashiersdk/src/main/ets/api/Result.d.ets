export declare class Result {
    static getParamsError(): Map<string, string>;
    static getCancel(): Map<string, string>;
    static getDoubleRequest(): Map<string, string>;
    static parseResult(z37: ResultStatus, a38?: string): Map<string, string>;
    static parseResultV1(w37: number | string, x37: string, y37: string): Map<string, string>;
}
export declare class ResultStatus {
    static SUCCEEDED: ResultStatus;
    static FAILED: ResultStatus;
    static CANCELED: ResultStatus;
    static NETWORK_ERROR: ResultStatus;
    static ACTIVITY_NOT_START_EXIT: ResultStatus;
    static PARAMS_ERROR: ResultStatus;
    static DOUBLE_REQUEST: ResultStatus;
    static PAY_WAITTING: ResultStatus;
    status: number;
    memo: string;
    constructor(u37: number, v37: string);
    toString(): string;
    static getResultStatus(t37: number): ResultStatus;
}
