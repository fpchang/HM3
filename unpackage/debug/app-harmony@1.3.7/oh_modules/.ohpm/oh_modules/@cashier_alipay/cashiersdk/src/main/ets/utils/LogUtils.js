import { debug } from './Utils';
export class LogUtils {
    static setupLogCallback(y34) {
        LogUtils.logCb = y34;
    }
    static writeLog(t34) {
        try {
            const v34 = LogUtils.logCb;
            if (v34) {
                const w34 = new Date();
                const x34 = `${w34.getHours()}:${w34.getMinutes()}:${w34.getSeconds()}.${w34.getMilliseconds()}`;
                v34(`[AlipaySDK] ${x34} ${t34}`);
            }
            debug(`LogUtils`, t34);
        }
        catch (u34) { }
    }
    static d(r34, s34) {
        r34 = r34 || '';
        s34 = s34 || '';
        LogUtils.writeLog(`[${r34}][${s34}]`);
    }
    static i(p34, q34) {
        p34 = p34 || '';
        q34 = q34 || '';
        LogUtils.writeLog(`[${p34}][${q34}]`);
    }
    static w(n34, o34) {
        n34 = n34 || '';
        o34 = o34 || '';
        LogUtils.writeLog(`[${n34}][${o34}]`);
    }
    static e(l34, m34) {
        l34 = l34 || '';
        m34 = m34 || '';
        LogUtils.writeLog(`[${l34}][${m34}]`);
    }
    static eStack(i34, j34, k34) {
        i34 = i34 || '';
        j34 = j34 || '';
        if (k34) {
            LogUtils.writeLog(`[${i34}][${j34}] ${k34.stack}`);
            return;
        }
        LogUtils.writeLog(`[${i34}][${j34}] `);
    }
    static printExceptionStackTrace(h34) {
        if (h34) {
            LogUtils.writeLog(h34.stack ?? '');
            return;
        }
    }
}
