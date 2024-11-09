export interface IRDSModule {
    startEngine(pageName: string, args: Map<string, string>): IRDSEngine;
    executeEngine(engine: IRDSEngine): string;
    stopEngine(engine: IRDSEngine): boolean;
}
export interface IRDSEngine {
    onPage(refPageName: string): void;
    onControlClick(ctrlName: string): void;
    onKeyDown(ctrlName: string, event: KeyEvent): void;
    onGetFocus(ctrlName: string): void;
    onLostFocus(ctrlName: string): void;
    onTouchScreen(ctrlName: string, event: TouchEvent): void;
    onPageEnd(updateUser: string): void;
    onEvent(eventType: RDSEvent, eventParam?: string, eventValue?: object): void;
}
export declare const enum RDSEvent {
    RDS_PAGE_START = 0,
    RDS_CONTROL_CLICK = 1,
    RDS_KEY_DOWN = 2,
    RDS_GET_FOCUS = 3,
    RDS_LOST_FOCUS = 4,
    RDS_TOUCH_SCREEN = 5,
    RDS_PAGE_END = 6
}
export declare const enum RDSParamKey {
    UTDID = "utdid",
    TID = "tid",
    APPNAME = "appname",
    APPVER = "appver",
    USER = "user",
    SDKVER = "sdkver",
    SDKNAME = "sdkname",
    PACKAGENAME = "appPackageName"
}
