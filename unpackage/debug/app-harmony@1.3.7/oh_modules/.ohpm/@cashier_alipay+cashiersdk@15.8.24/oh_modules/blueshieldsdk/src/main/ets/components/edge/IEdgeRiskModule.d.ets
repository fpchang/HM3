export interface IEdgeRiskModule {
    initialize(): number;
    postUserAction(ua: EdgeRiskUAMode, properties: Map<string, string>): number;
    getRiskResult(ua: EdgeRiskUAMode, properties: Map<string, string>, timeout: number): EdgeRiskResult;
}
export declare class EdgeRiskResult {
    result: number;
    status: number;
    rdsResult: string;
    sealedData: string;
    data: string;
}
export declare const enum EdgeRiskUAMode {
    UA_KCART_CALL = "kcart_call",
    UA_LOGIN_CALL = "login",
    UA_REGISTER_CALL = "register",
    UA_TRANSFER_CALL = "transfer",
    UA_SCAN_CALL = "scan",
    UA_SPORTS_CALL = "sports",
    UA_AUTO_TRACK = "autoTrack",
    UA_FAST_RISK_CONTROL = "fastRiskControl",
    UA_MOBILE_AEC = "mobileaec"
}
