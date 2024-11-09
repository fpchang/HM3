import { isEmpty } from '../utils/Utils';
import json from '@ohos.util.json';
import bundleManager from "@ohos.bundle.bundleManager";
import { StatisticManager } from './StatisticManager';
import { TidStorage } from '../tid/TidStorage';
import { GlobalContext } from '../sys/GlobalContext';
import i18n from "@ohos.i18n";
import deviceInfo from "@ohos.deviceInfo";
import connection from "@ohos.net.connection";
import util from '@ohos.util';
import BuildProfile from '../../../../BuildProfile';
export class StatisticRecord {
    constructor(b28, c28) {
        this.mTime = "";
        this.mTrade = "";
        this.mApp = "";
        this.mSDK = "";
        this.mIds = "";
        this.mDevice = "";
        this.mResult = "";
        this.mBehavior = "";
        this.mException = "";
        this.mTemplate = "";
        this.mBizContext = b28;
        this.mTime = this.buildTime();
        this.mApp = this.buildApp();
        this.mSDK = this.buildSDK(c28 ? 0 : StatisticManager.localSequence());
        this.mIds = this.buildIds();
        this.mDevice = this.buildDevice();
        this.mResult = "-";
        this.mTemplate = "-";
    }
    putError(x27, y27, z27) {
        let a28 = this.getStackTraceMessage(z27);
        this.putErrorWithMsg(x27, y27, a28);
    }
    putErrorWithRes(s27, t27, u27, v27) {
        let w27 = this.getStackTraceMessage(u27);
        this.putErrorInner(s27, t27, v27 + ": " + w27);
    }
    putErrorInner(o27, p27, q27) {
        let r27 = "";
        if (!isEmpty(this.mException)) {
            r27 += "^";
        }
        r27 += `${o27},${p27},${isEmpty(q27) ? "-" : this.filter(q27)},${this.filter(this.genEventTime())}`;
        this.mException += r27;
    }
    putErrorWithMsg(l27, m27, n27) {
        this.putErrorInner(l27, m27, n27);
    }
    putActionWithDetail(i27, j27, k27) {
        this.putActionInner("", i27, j27 + "|" + k27);
    }
    putAction(g27, h27) {
        this.putActionInner("", g27, h27);
    }
    putActionInner(c27, d27, e27) {
        let f27 = "";
        if (!isEmpty(this.mBehavior)) {
            f27 += "^";
        }
        f27 += `${isEmpty(c27) ? "-" : this.filter(c27)},${this.filter(d27)},${this.filter(e27)},${this.filter(this.genEventTime())}`;
        this.mBehavior += f27;
    }
    genEventTime() {
        return new Date().toISOString();
    }
    filter(b27) {
        if (isEmpty(b27)) {
            return "";
        }
        return b27.replace("[", "【")
            .replace("]", "】")
            .replace("(", "（")
            .replace(")", "）")
            .replace(",", "，")
            .replace("^", "~")
            .replace("#", "＃");
    }
    filterField(a27) {
        return isEmpty(a27) ? "-" : a27;
    }
    getStackTraceMessage(z26) {
        if (!z26) {
            return "";
        }
        return z26.stack ?? "";
    }
    format(y26) {
        this.mTrade = this.buildTrade(y26);
        return `[(${this.mTime}),(${this.mTrade}),(${this.mApp}),(${this.mSDK}),(${this.mIds}),(${this.mDevice}),(${this.mResult}),(${this.filterField(this.mBehavior)}),(${this.filterField(this.mException)}),(${this.mTemplate})]`;
    }
    buildTime() {
        let w26 = new Date();
        let x26 = w26.getFullYear() + "-" + (w26.getMonth() + 1) + "-" + w26.getDate() + "-" + w26.getHours() + ":" + w26.getMinutes() + ":" + w26.getSeconds();
        return `${this.randomUuid()},${x26}`;
    }
    randomUuid() {
        return util.generateRandomUUID();
    }
    buildTrade(l26) {
        let m26 = "";
        let n26 = "";
        let o26 = "";
        if (!l26) {
            l26 = "";
        }
        let p26 = l26.split("&");
        if (p26 != null) {
            for (let q26 of p26) {
                let r26 = q26.split("=");
                if (r26 != null && r26.length == 2) {
                    if (r26[0] == StatisticRecord.KEY_TRADE_PARTNER) {
                        m26 = r26[1].replace("\"", "");
                    }
                    else if (r26[0] == StatisticRecord.KEY_TRADE_OUT_TRADE_NO) {
                        n26 = r26[1].replace("\"", "");
                    }
                    else if (r26[0] == StatisticRecord.KEY_TRADE_NO) {
                        o26 = r26[1].replace("\"", "");
                    }
                    else if (r26[0] == StatisticRecord.KEY_BIZ_CONTENT) {
                        try {
                            const u26 = decodeURIComponent(r26[1]);
                            const v26 = json.parse(u26);
                            if (isEmpty(n26)) {
                                n26 = v26[StatisticRecord.KEY_TRADE_OUT_TRADE_NO];
                            }
                        }
                        catch (t26) { }
                    }
                    else if (r26[0] == StatisticRecord.KEY_APP_ID) {
                        try {
                            if (isEmpty(m26)) {
                                m26 = r26[1];
                            }
                        }
                        catch (s26) { }
                    }
                }
            }
        }
        o26 = this.filter(o26);
        n26 = this.filter(n26);
        m26 = this.filter(m26);
        return `${o26},${n26},-,${m26},-,-,-`;
    }
    buildApp() {
        let i26 = "-";
        let j26 = "-";
        let k26 = bundleManager.getBundleInfoForSelfSync(bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION);
        i26 = k26.name;
        j26 = k26.versionName;
        return `${this.filter(i26)},${this.filter(j26)},-,-,-`;
    }
    buildSDK(f26) {
        let g26 = this.filter(BuildProfile.HAR_VERSION);
        let h26 = this.filter((BuildProfile.HAR_VERSION));
        return `harmony,3,${g26},${h26},com.alipay.mcpay,5.0,-,~${f26},-`;
    }
    buildIds() {
        let d26 = this.filter(TidStorage.getInstance(this.mBizContext).getTid());
        let e26 = this.filter(GlobalContext.getInstance().getUtdid(getContext()));
        return `${d26},${e26},-,-,-`;
    }
    buildDevice() {
        let u25 = this.filter(i18n.System.getSystemLocale());
        let v25 = deviceInfo.osFullName;
        let w25 = deviceInfo.distributionOSVersion;
        let x25 = deviceInfo.productModel;
        let y25 = "-";
        let z25 = "0";
        let a26 = this.filter(connection.getAppNetSync().netId.toString());
        let b26 = "gw";
        let c26 = this.filter(deviceInfo.ODID);
        return `${u25},${v25},${w25},${x25},${y25},${z25},${a26},${b26},${c26},-`;
    }
}
StatisticRecord.ET_NET = "net";
StatisticRecord.ET_BIZ = "biz";
StatisticRecord.KEY_TRADE_PARTNER = "partner";
StatisticRecord.KEY_TRADE_OUT_TRADE_NO = "out_trade_no";
StatisticRecord.KEY_TRADE_NO = "trade_no";
StatisticRecord.KEY_BIZ_CONTENT = "biz_content";
StatisticRecord.KEY_APP_ID = "app_id";
