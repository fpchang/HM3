export declare class LogUtils {
    private static logCb;
    static setupLogCallback(g37: (logLine: string) => void): void;
    private static writeLog;
    static d(e37: string | undefined, f37: string | undefined): void;
    static i(c37: string | undefined, d37: string | undefined): void;
    static w(a37: string | undefined, b37: string | undefined): void;
    static e(y36: string | undefined, z36: string | undefined): void;
    static eStack(v36: string | undefined, w36: string | undefined, x36: Error | undefined): void;
    static printExceptionStackTrace(u36: Error | undefined): void;
}
