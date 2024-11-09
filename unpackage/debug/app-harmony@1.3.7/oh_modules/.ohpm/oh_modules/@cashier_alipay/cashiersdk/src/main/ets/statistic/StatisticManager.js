import { BizContext } from '../context/BizContext';
import { LogUtils } from '../utils/LogUtils';
import { PreferenceUtils } from '../utils/PreferenceUtils';
import { getRandomString, isEmpty } from '../utils/Utils';
import { JSONArray } from '../utils/JSONArray';
import { MdapLogPacket } from '../network/MdapLogPacket';
export class StatisticManager {
    constructor() {
    }
    static stash(q25, r25, s25) {
        if (!q25) {
            return;
        }
        try {
            RecordPref.append(q25.getSafeContext(), q25.record?.format(r25), s25);
        }
        catch (t25) {
            LogUtils.printExceptionStackTrace(t25);
        }
    }
    static submit(n25, o25, p25) {
        if (!n25) {
            return;
        }
        RecordUploader.uploadNew(n25.getSafeContext(), n25.record?.format(o25), p25);
    }
    static forceUploadExisting(m25) {
        if (!m25) {
            return;
        }
        RecordUploader.uploadExisting(m25.getSafeContext());
    }
    static putError(i25, j25, k25, l25) {
        if (!i25) {
            return;
        }
        i25.record?.putError(j25, k25, l25);
    }
    static putErrorWithRes(d25, e25, f25, g25, h25) {
        if (d25 == null || g25 == null) {
            return;
        }
        d25.record?.putErrorWithRes(e25, f25, g25, h25);
    }
    static putAction(z24, a25, b25, c25 = '') {
        if (z24 == null) {
            return;
        }
        z24.record?.putActionWithDetail(a25, b25, c25);
    }
    static localSequence() {
        const y24 = "alipay_cashier_statistic_v";
        return SPrefSequenceManager.nextSeq(y24);
    }
    static requestSequence() {
        const x24 = "alipay_cashier_ap_seq_v";
        return SPrefSequenceManager.nextSeq(x24);
    }
}
class SPrefSequenceManager {
    static nextSeq(t24) {
        let u24 = 0;
        try {
            let w24 = PreferenceUtils.getInstance().get(t24, '');
            if (!isEmpty(w24)) {
                u24 = Number.parseFloat(w24);
            }
            PreferenceUtils.getInstance().put(t24, u24 + 1);
        }
        catch (v24) {
        }
        return 0;
    }
}
SPrefSequenceManager.TAG = 'SPrefSequenceManager';
class RecordPref {
    static append(p24, q24, r24) {
        LogUtils.d(RecordPref.TAG, "stat append " + r24 + " , " + q24);
        if (p24 == undefined || isEmpty(q24)) {
            return;
        }
        if (isEmpty(r24)) {
            r24 = getRandomString(16);
        }
        let s24 = RecordPref.assureGet();
        if (s24.map.size > 20) {
            s24.map.clear();
        }
        s24.map.set(r24, q24 ?? '');
        RecordPref.assurePut(s24);
        return r24;
    }
    static peek(m24) {
        LogUtils.d(RecordPref.TAG, "stat peek");
        if (!m24) {
            return undefined;
        }
        let n24 = RecordPref.assureGet();
        if (n24.map.size == 0) {
            return undefined;
        }
        try {
            return n24.map.entries().next().value;
        }
        catch (o24) {
            LogUtils.printExceptionStackTrace(o24);
            return undefined;
        }
    }
    static remove(c24, d24) {
        LogUtils.d(RecordPref.TAG, "stat remove " + d24);
        if (!c24 || d24 == null) {
            return 0;
        }
        let e24 = RecordPref.assureGet();
        if (e24.map.size == 0) {
            return 0;
        }
        try {
            let h24 = new Array();
            e24.map.forEach((k24, l24) => {
                if (d24 == k24) {
                    h24.push(l24);
                }
            });
            for (let j24 of h24) {
                e24.map.delete(j24);
            }
            RecordPref.assurePut(e24);
            return h24.length;
        }
        catch (f24) {
            LogUtils.printExceptionStackTrace(f24);
            let g24 = e24.map.size;
            RecordPref.assurePut(new LogStructure());
            return g24;
        }
    }
    static assureGet() {
        try {
            let b24 = PreferenceUtils.getInstance().get(RecordPref.KEY_RECORD, '');
            if (isEmpty(b24)) {
                return new LogStructure();
            }
            else {
                return new LogStructure(b24);
            }
        }
        catch (a24) {
            LogUtils.printExceptionStackTrace(a24);
            return new LogStructure();
        }
    }
    static assurePut(w23) {
        try {
            let y23 = w23 == null ? new LogStructure() : w23;
            let z23 = y23.toJSONString();
            PreferenceUtils.getInstance().put(RecordPref.KEY_RECORD, z23);
        }
        catch (x23) {
            LogUtils.printExceptionStackTrace(x23);
        }
    }
}
RecordPref.TAG = 'RecordPref';
RecordPref.KEY_RECORD = "alipay_cashier_statistic_record";
class RecordUploader {
    static uploadNew(s23, t23, u23, v23 = "") {
        if (!s23 || t23 == null || u23 == null) {
            return;
        }
        RecordUploader.innerUpload(s23, t23, v23);
    }
    static uploadExisting(r23) {
        RecordUploader.innerUpload(r23, undefined, "");
    }
    static async innerUpload(k23, l23, m23 = "") {
        if (!k23) {
            return;
        }
        if (!isEmpty(l23)) {
            RecordPref.append(k23, l23, m23);
        }
        if (!isEmpty(l23)) {
            let q23 = await RecordUploader.blockingSubmit(k23, l23);
            if (!q23) {
                return;
            }
        }
        for (let n23 = 0; n23 < 4; n23++) {
            const o23 = RecordPref.peek(k23);
            if (isEmpty(o23)) {
                break;
            }
            let p23 = await RecordUploader.blockingSubmit(k23, o23);
            if (!p23) {
                break;
            }
        }
    }
    static blockingSubmit(a23, b23) {
        return new Promise(async (d23, e23) => {
            let f23 = new MdapLogPacket();
            let g23 = await BizContext.createInstance(a23);
            f23.request(g23, b23 ?? '').then((j23) => {
                if (j23 != null) {
                    RecordPref.remove(a23, b23);
                }
                d23(true);
            }).catch(() => {
                d23(false);
            });
        });
    }
}
class LogStructure {
    constructor(v22 = '') {
        this.map = new Map();
        if (isEmpty(v22)) {
            return;
        }
        try {
            const x22 = new JSONArray(v22);
            for (let y22 = 0; y22 < x22.length(); y22++) {
                const z22 = x22[y22];
                this.map.set(z22.getString(0), z22.getString(1));
            }
        }
        catch (w22) {
            LogUtils.printExceptionStackTrace(w22);
        }
    }
    toJSONString() {
        try {
            const s22 = new JSONArray();
            for (const t22 of this.map.entries()) {
                const u22 = new JSONArray();
                u22.put(t22[0]);
                u22.put(t22[1]);
                s22.put(u22);
            }
            return s22.toString();
        }
        catch (r22) {
            LogUtils.printExceptionStackTrace(r22);
            return (new JSONArray()).toString();
        }
    }
}
