import { isEmpty } from './Utils';
export class ExternalInfoUtils {
    static getMspParam(j31) {
        if (isEmpty(j31)) {
            return "";
        }
        let k31 = j31.split("&");
        if (k31.length == 0) {
            return "";
        }
        let l31 = null;
        let m31 = null;
        let n31 = null;
        let o31 = null;
        for (const r31 of k31) {
            if (isEmpty(l31)) {
                l31 = ExternalInfoUtils.resolveBizType(r31);
            }
            if (isEmpty(m31)) {
                m31 = ExternalInfoUtils.resolveBizNo(r31);
            }
            if (isEmpty(n31)) {
                n31 = ExternalInfoUtils.resolveTradeNo(r31);
            }
            if (isEmpty(o31)) {
                o31 = ExternalInfoUtils.resolveAppUserId(r31);
            }
        }
        let p31 = ``;
        if (!isEmpty(l31)) {
            p31 += `biz_type=${l31};`;
        }
        if (!isEmpty(m31)) {
            p31 += `biz_no=${m31};`;
        }
        if (!isEmpty(n31)) {
            p31 += `trade_no=${n31};`;
        }
        if (!isEmpty(o31)) {
            p31 += `app_userid=${o31};`;
        }
        let q31 = p31.toString();
        if (q31.endsWith(";")) {
            q31 = q31.substring(0, q31.length - 1);
        }
        return q31;
    }
    static resolveAppUserId(i31) {
        if (!i31.includes("app_userid")) {
            return null;
        }
        else {
            return ExternalInfoUtils.parseValue(i31);
        }
    }
    static resolveTradeNo(h31) {
        if (!h31.includes("trade_no") || h31.startsWith("out_trade_no")) {
            return null;
        }
        else {
            return ExternalInfoUtils.parseValue(h31);
        }
    }
    static resolveBizNo(g31) {
        if (!g31.includes("biz_no")) {
            return null;
        }
        else {
            return ExternalInfoUtils.parseValue(g31);
        }
    }
    static resolveBizType(f31) {
        if (!f31.includes("biz_type")) {
            return null;
        }
        else {
            return ExternalInfoUtils.parseValue(f31);
        }
    }
    static parseValue(c31) {
        if (c31.includes("=")) {
            let d31 = c31.split("=");
            let e31 = null;
            if (d31.length > 1) {
                e31 = d31[1];
                if (e31.includes("\"")) {
                    e31 = e31.replace("\"", "");
                }
            }
            return e31;
        }
        else {
            return null;
        }
    }
}
