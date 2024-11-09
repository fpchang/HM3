import BuildProfile from '../../../../BuildProfile';
import { doLoopSHA256, elapsedRealtime, isEmpty } from '../utils/Utils';
import bundleManager from "@ohos.bundle.bundleManager";
import { StatisticRecord } from '../statistic/StatisticRecord';
import { DynamicConfig } from '../config/DynamicConfig';
import deviceInfo from "@ohos.deviceInfo";
const PAIR_CONNECTION = "\"&";
const PAIR_AND = "&";
const PAIR_BIZCONTEXT = "bizcontext=\"";
const PAIR_BIZCONTEXT_ENCODED = "bizcontext=";
const PAIR_QUOTATION_MARK = "\"";
const KEY_APP_KEY = "appkey";
const KEY_AND_LITE = "ty";
const KEY_SDK_VERSION = "sv";
const KEY_PACKAGE_NAME = "an";
const KEY_SETTING_FILTER = "setting";
const KEY_PACKAGE_VERSION = "av";
const KEY_START_TIME = "sdk_start_time";
const KEY_EXT_INFO = "extInfo";
const KEY_AP_LINK_TOKEN = "ap_link_token";
const KEY_ACT_INFO = "act_info";
const CHARSET_UTF8 = "UTF-8";
export class BizContext {
    constructor() {
        this.uniquePayload = '';
    }
    static async createInstance(k12, l12 = '', m12 = "") {
        const n12 = new BizContext();
        await n12.init(k12, l12, m12);
        return n12;
    }
    async init(h12, i12 = '', j12 = "") {
        this.context = h12;
        this.uniquePayload = i12;
        this.invokeTag = j12;
        this.record = new StatisticRecord(this, isEmpty(j12));
        await this.generateExtPayTradeToken(i12);
        await DynamicConfig.getInstance().updateSync(this, 1);
    }
    async generateExtPayTradeToken(e12) {
        let f12 = this.context?.applicationInfo.name ?? '';
        let g12 = await doLoopSHA256(`${f12}${e12}${elapsedRealtime()}${deviceInfo.ODID}`);
        g12 = g12.substring(0, 32);
        this.apLinkToken = `EP1${g12}${elapsedRealtime()}`;
    }
    format(c12) {
        if (c12.length == 0) {
            return c12;
        }
        if (c12.startsWith(BizContext.NEW_EXTERNAL_INFO_WITH_DOUBLE_EQUAL)) {
            return this.formatJsonEncode(c12);
        }
        let d12 = this.isTradeEncoded(c12);
        if (d12) {
            return this.formatEncoded(c12);
        }
        else {
            return this.formatNoEncoded(c12);
        }
    }
    getSafeContext() {
        return this.context ?? getContext();
    }
    formatEncoded(u11) {
        let v11 = u11;
        try {
            let x11 = this.findBizContext(u11, PAIR_AND, PAIR_BIZCONTEXT_ENCODED);
            if (isEmpty(x11)) {
                v11 = u11 + PAIR_AND + this.buildBizContext(PAIR_BIZCONTEXT_ENCODED, "");
                return v11;
            }
            let y11 = u11.indexOf(x11);
            let z11 = u11.substring(0, y11);
            let a12 = u11.substring(y11 + x11.length);
            let b12 = this.formatBizContextForKeyValueOrderStr(x11, PAIR_BIZCONTEXT_ENCODED, "");
            v11 = z11 + b12 + a12;
        }
        catch (w11) {
            v11 = u11;
        }
        return v11;
    }
    formatNoEncoded(m11) {
        let n11 = m11;
        try {
            let p11 = this.findBizContext(m11, PAIR_CONNECTION, PAIR_BIZCONTEXT);
            if (isEmpty(p11)) {
                n11 = m11 + PAIR_AND + this.buildBizContext(PAIR_BIZCONTEXT, PAIR_QUOTATION_MARK);
                return n11;
            }
            if (!p11.endsWith(PAIR_QUOTATION_MARK)) {
                p11 += PAIR_QUOTATION_MARK;
            }
            let q11 = m11.indexOf(p11);
            let r11 = m11.substring(0, q11);
            let s11 = m11.substring(q11 + p11.length);
            let t11 = this.formatBizContextForKeyValueOrderStr(p11, PAIR_BIZCONTEXT, PAIR_QUOTATION_MARK);
            n11 = r11 + t11 + s11;
        }
        catch (o11) {
            n11 = m11;
        }
        return n11;
    }
    formatBizContextForKeyValueOrderStr(f11, g11, h11) {
        let i11 = f11;
        i11 = i11.substring(g11.length);
        i11 = i11.substring(0, i11.length - h11.length);
        let j11 = {};
        let k11 = false;
        if (i11.length >= 2 && i11.startsWith("\"") && i11.endsWith("\"")) {
            j11 = JSON.parse(i11.substring(1, i11.length - 1));
            k11 = true;
        }
        else {
            j11 = JSON.parse((i11));
            k11 = false;
        }
        let l11 = this.buildSimpleBizContext(j11);
        if (k11) {
            l11 = "\"" + l11 + "\"";
        }
        return g11 + l11 + h11;
    }
    buildBizContext(d11, e11) {
        return d11 + this.buildSimpleBizContext({}) + e11;
    }
    findBizContext(w10, x10, y10) {
        if (w10.length == 0) {
            return "";
        }
        let z10 = "";
        let a11 = w10.split(x10);
        a11.forEach((c11) => {
            if (!isEmpty(c11) && c11.startsWith(y10)) {
                z10 = c11;
            }
        });
        return z10;
    }
    isTradeEncoded(v10) {
        return v10.indexOf(PAIR_CONNECTION) <= 0;
    }
    formatJsonEncode(p10) {
        let q10 = p10;
        try {
            const s10 = p10.substring(BizContext.NEW_EXTERNAL_INFO_WITH_DOUBLE_EQUAL.length);
            const t10 = JSON.parse(s10);
            const u10 = t10.bizcontext ?? "";
            t10.put("bizcontext", this.formatBizContextForJsonOrderStr(u10));
            q10 = BizContext.NEW_EXTERNAL_INFO_WITH_DOUBLE_EQUAL + t10.toString();
        }
        catch (r10) {
            q10 = p10;
        }
        return q10;
    }
    formatBizContextForJsonOrderStr(n10) {
        let o10 = JSON.parse(n10);
        return this.buildSimpleBizContext(o10);
    }
    buildSimpleBizContext(j10) {
        try {
            if (!j10[KEY_APP_KEY]) {
                j10[KEY_APP_KEY] = "2014052600006128";
            }
            if (!j10[KEY_AND_LITE]) {
                j10[KEY_AND_LITE] = "and_lite";
            }
            if (!j10[KEY_SDK_VERSION]) {
                j10[KEY_SDK_VERSION] = BuildProfile.HAR_VERSION;
            }
            if (!j10[KEY_PACKAGE_NAME]) {
                j10[KEY_PACKAGE_NAME] = "com.alipay.mobilewallet";
            }
            if (!j10[KEY_PACKAGE_VERSION]) {
                let l10 = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
                let m10 = l10.versionName;
                j10[KEY_PACKAGE_VERSION] = m10;
            }
            if (!j10[KEY_START_TIME]) {
                j10[KEY_START_TIME] = Date.now();
            }
            if (!j10[KEY_EXT_INFO]) {
                j10[KEY_EXT_INFO] = JSON.parse(`{"KEY_AP_LINK_TOKEN":"${this.apLinkToken}"}`);
            }
            if (!j10[KEY_ACT_INFO]) {
                j10[KEY_ACT_INFO] = "alipay" + "|" + "null";
            }
            return JSON.stringify(j10);
        }
        catch (k10) {
            return j10 != null ? JSON.stringify(j10) : "{}";
        }
    }
}
BizContext.NEW_EXTERNAL_INFO_WITH_DOUBLE_EQUAL = "new_external_info==";
