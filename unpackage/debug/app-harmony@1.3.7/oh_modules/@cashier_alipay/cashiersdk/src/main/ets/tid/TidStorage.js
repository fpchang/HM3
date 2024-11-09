import { isEmpty } from '../utils/Utils';
import dataPreferences from '@ohos.data.preferences';
import { LogUtils } from '../utils/LogUtils';
export class TidStorage {
    constructor() {
        this.mTid = undefined;
        this.mClientKey = undefined;
        this.mTimestamp = new Date().getTime();
        this.mVimei = undefined;
        this.mVimsi = undefined;
        this.isInit = false;
    }
    load(b29) {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        let c29 = undefined;
        let d29 = undefined;
        let e29 = new Date().getTime();
        let f29 = undefined;
        let g29 = undefined;
        try {
            let i29 = { name: TidStorage.PREF_TID_FILE };
            let j29 = dataPreferences.getPreferencesSync(b29.getSafeContext(), i29);
            if ((j29.hasSync(TidStorage.PREF_TID_INFO))) {
                let k29 = j29.getSync(TidStorage.PREF_TID_INFO, '').toString();
                if (k29 && !isEmpty(k29)) {
                    let l29 = JSON.parse(k29);
                    c29 = l29[TidStorage.KEY_TID];
                    d29 = l29[TidStorage.KEY_CLIENTKEY];
                    e29 = l29[TidStorage.KEY_TIMESTAMP];
                    f29 = l29[TidStorage.KEY_VIMEI];
                    g29 = l29[TidStorage.KEY_VIMSI];
                }
            }
        }
        catch (h29) {
            LogUtils.e('TidStorage', h29);
        }
        if (this.isIllegal(c29, d29, f29, g29)) {
            this.resetTid(b29);
            return;
        }
        this.mTid = c29;
        this.mClientKey = d29;
        this.mTimestamp = e29;
        this.mVimei = f29;
        this.mVimsi = g29;
    }
    isIllegal(x28, y28, z28, a29) {
        return isEmpty(x28) || isEmpty(y28) || isEmpty(z28) || isEmpty(a29);
    }
    resetTid(u28) {
        this.mTid = '';
        this.mClientKey = this.genClientKey();
        this.mTimestamp = new Date().getTime();
        this.mVimei = TidStorage.genVirtualCode();
        this.mVimsi = TidStorage.genVirtualCode();
        let v28 = { name: TidStorage.PREF_TID_FILE };
        let w28 = dataPreferences.getPreferencesSync(u28.getSafeContext(), v28);
        w28.deleteSync(TidStorage.PREF_TID_INFO);
        w28.flush();
    }
    genClientKey() {
        let t28 = new Date().getTime().toString(16);
        if (t28.length > 10) {
            t28 = t28.substring(t28.length - 10);
        }
        return t28;
    }
    static genVirtualCode() {
        let q28 = new Date().getTime();
        let r28 = q28.toString(16);
        let s28 = Math.floor(Math.random() * 1000 + 1000);
        r28 += s28;
        return r28;
    }
    static getInstance(p28 = undefined) {
        if (!TidStorage.instance) {
            TidStorage.instance = new TidStorage();
        }
        if (p28) {
            TidStorage.instance.load(p28);
        }
        return TidStorage.instance;
    }
    setTid(o28) {
        this.mTid = o28;
    }
    getTid() {
        return this.mTid ?? "";
    }
    save(l28, m28, n28) {
        if (isEmpty(m28) || isEmpty(n28)) {
            return;
        }
        this.mTid = m28;
        this.mClientKey = n28;
        this.mTimestamp = new Date().getTime();
        this.saveToLocal(l28);
    }
    saveToLocal(g28) {
        try {
            let i28 = {};
            i28[TidStorage.KEY_TID] = this.mTid;
            i28[TidStorage.KEY_CLIENTKEY] = this.mClientKey;
            i28[TidStorage.KEY_TIMESTAMP] = this.mTimestamp;
            i28[TidStorage.KEY_VIMEI] = this.mVimei;
            i28[TidStorage.KEY_VIMSI] = this.mVimsi;
            let j28 = { name: TidStorage.PREF_TID_FILE };
            let k28 = dataPreferences.getPreferencesSync(g28.getSafeContext(), j28);
            k28.putSync(TidStorage.PREF_TID_INFO, JSON.stringify(i28));
            k28.flush();
        }
        catch (h28) {
            LogUtils.e('TidStorage', h28);
        }
    }
    generateDesKey(e28) {
        let f28 = e28.getSafeContext().applicationInfo.name;
        f28 += "0000000000000000000000000000";
        return f28.substring(0, 24);
    }
    getClientKey() {
        return this.mClientKey ?? "";
    }
}
TidStorage.PREF_TID_FILE = "alipay_tid_storage";
TidStorage.PREF_TID_INFO = "tidinfo";
TidStorage.KEY_TID = "tid";
TidStorage.KEY_CLIENTKEY = "client_key";
TidStorage.KEY_TIMESTAMP = "timestamp";
TidStorage.KEY_VIMEI = "vimei";
TidStorage.KEY_VIMSI = "vimsi";
