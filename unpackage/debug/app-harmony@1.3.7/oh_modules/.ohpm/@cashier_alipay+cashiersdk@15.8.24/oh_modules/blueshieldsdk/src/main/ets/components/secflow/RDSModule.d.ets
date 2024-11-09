import { IRDSEngine, IRDSModule, RDSEvent } from './IRDSModule';
export declare class RDSModule implements IRDSModule {
    startEngine(b21: string, c21: Map<string, string>): IRDSEngine;
    executeEngine(a21: IRDSEngine): string;
    stopEngine(z20: IRDSEngine): boolean;
}
export declare class RDSEngine implements IRDSEngine {
    private pageName;
    constructor(y20: string);
    onPage(x20: string): void;
    onControlClick(w20: string): void;
    onKeyDown(u20: string, v20: KeyEvent): void;
    onGetFocus(t20: string): void;
    onLostFocus(s20: string): void;
    onTouchScreen(q20: string, r20: TouchEvent): void;
    onPageEnd(p20: string): void;
    onEvent(m20: RDSEvent, n20?: string, o20?: object): void;
}
