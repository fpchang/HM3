import { ServerUrlUtil } from '../utils/ServerUrlUtil';
import { isEmpty } from '../utils/Utils';
import { Letter } from './model/Letter';
import { LetterPacker, PackInfo } from './model/LetterPacker';
import http from "@ohos.net.http";
import deviceInfo from "@ohos.deviceInfo";
import { GlobalContext } from '../sys/GlobalContext';
import { TidStorage } from '../tid/TidStorage';
import { GlobalDefine } from '../const/GlobalDefine';
import { GlobalConstants } from '../const/GlobalConstants';
import { ExternalInfoUtils } from '../utils/ExternalInfoUtils';
import { MspConfig } from '../data/MspConfig';
import HashMap from "@ohos.util.HashMap";
import { LogUtils } from '../utils/LogUtils';
import { ApdIdManager } from '../security/ApdIdManager';
import { StatisticManager } from '../statistic/StatisticManager';
import { StatisticRecord } from '../statistic/StatisticRecord';
export const HTTP_HEADER_MSP_GZIP = "msp-gzip";
export const HTTP_HEADER_MSP_PARAM = "Msp-Param";
export const HTTP_HEADER_OPERATION_TYPE = "Operation-Type";
export const HTTP_HEADER_CONTENT_TYPE = "content-type";
export const HTTP_HEADER_VERSION = "Version";
export const HTTP_HEADER_APPID = "AppId";
export const HTTP_HEADER_DESMODE = "des-mode";
export const HTTP_HEADER_CONTENT_TYPE_H = "Content-Type";
export const HTTP_HEADER_ACCEPT_CHARSET = "Accept-Charset";
export const HTTP_HEADER_CONNECTION = "Connection";
export const HTTP_HEADER_KEEP_ALIVE = "Keep-Alive";
export const HTTP_HEADER_UTDID = "utdId";
export const HTTP_HEADER_LOG_HEADER = "logHeader";
export const HTTP_HEADER_BIZ_CODE = "bizCode";
export const HTTP_HEADER_PRODUCT_ID = "productId";
export const HTTP_HEADER_PRODUCT_VERSION = "productVersion";
export const HTTP_HEADER_CONTENT_ENCODING = "Content-Encoding";
export const HTTP_HEADER_USER_AGENT = "User-Agent";
const LETTER_NAMESPACE = "namespace";
const LETTER_API_NAME = "api_name";
const LETTER_API_VERSION = "api_version";
const LETTER_DATA = "data";
const LETTER_PARAMS = "params";
const LETTER_PUBLIC_KEY = "public_key";
const LETTER_DEVICE = "device";
const LETTER_ACTION = "action";
const LETTER_TYPE = "type";
const LETTER_METHOD = "method";
export class NetworkTask {
    constructor() {
        this.isUpGzip = true;
        this.isEncrypt = true;
    }
    buildHeaders(f21, g21) {
        let h21 = new Map();
        h21[HTTP_HEADER_MSP_GZIP] = f21.toString();
        h21[HTTP_HEADER_OPERATION_TYPE] = "alipay.msp.cashier.dispatch.bytes";
        h21[HTTP_HEADER_CONTENT_TYPE] = "application/octet-stream";
        h21[HTTP_HEADER_VERSION] = "2.0";
        h21[HTTP_HEADER_APPID] = "TAOBAO";
        h21[HTTP_HEADER_MSP_PARAM] = ExternalInfoUtils.getMspParam(g21);
        h21[HTTP_HEADER_DESMODE] = "CBC";
        return h21;
    }
    needStatic() {
        return false;
    }
    getApiVersion() {
        return "4.9.0";
    }
    ;
    buildEnvelop(c21) {
        let d21 = new Map();
        d21.set(LETTER_DEVICE, deviceInfo.marketName);
        d21.set(LETTER_NAMESPACE, "com.alipay.mobilecashier");
        d21.set(LETTER_API_NAME, "com.alipay.mcpay");
        d21.set(LETTER_API_VERSION, this.getApiVersion());
        let e21 = new HashMap();
        return this.buildEnvelopInner(c21, d21, e21);
    }
    buildEnvelopInner(r20, s20, t20) {
        let u20 = {};
        let v20 = {};
        if (s20 != null) {
            s20.forEach((a21, b21) => {
                v20[b21] = a21;
            });
        }
        if (t20 != null) {
            t20.forEach((x20, y20) => {
                t20.set(y20, x20);
            });
            v20[LETTER_PARAMS] = t20;
        }
        u20[LETTER_DATA] = v20;
        return JSON.stringify(u20);
    }
    static buildAction(n20, o20) {
        let p20 = {};
        let q20 = {};
        q20[LETTER_TYPE] = n20;
        q20[LETTER_METHOD] = o20;
        p20[LETTER_ACTION] = q20;
        return p20;
    }
    buildBody(g20, h20, i20) {
        let j20 = GlobalContext.getInstance();
        let k20 = TidStorage.getInstance(g20);
        let l20 = i20;
        try {
            l20[GlobalDefine.EXTERNAL_INFO] = h20;
            l20[GlobalDefine.TID] = k20.getTid();
            l20[GlobalDefine.USER_AGENT] = j20.getConfig().getUserAgent(g20, k20, this.isWifiMocked());
            l20[GlobalDefine.HAS_ALIPAY] = false;
            l20[GlobalDefine.HAS_MSP] = false;
            l20[GlobalDefine.APP_KEY] = GlobalConstants.APP_KEY;
            l20[GlobalDefine.UTDID] = j20.getUtdid(g20.getSafeContext());
            l20[GlobalDefine.NEW_CLIENT_KEY] = k20.getClientKey();
            l20[GlobalDefine.PA] = MspConfig.getPa(g20.getSafeContext());
        }
        catch (m20) {
            if (this.needStatic()) {
                StatisticManager.putErrorWithRes(g20, StatisticRecord.ET_NET, `${this.getName()}|Body`, m20, "BodyErr");
            }
            LogUtils.printExceptionStackTrace(m20);
        }
        return JSON.stringify(l20);
    }
    request(e20, f20) {
        return this.requestWithUrl(e20, f20, ServerUrlUtil.getUrl());
    }
    requestWithUrl(b20, c20, d20) {
        return this.doRequest(b20, c20, d20, true);
    }
    doRequest(c19, d19, e19, f19) {
        return new Promise(async (h19, i19) => {
            LogUtils.d(GlobalConstants.GENERAL_TAG, `${this.getName()}|NETWORK Packet: ${e19}`);
            TidStorage.getInstance(c19);
            let j19 = await ApdIdManager.getInstance().init(c19.getSafeContext());
            LogUtils.d(GlobalConstants.GENERAL_TAG, `${this.getName()}|NETWORK ApdId: ${j19}`);
            if (this.needStatic()) {
                StatisticManager.putAction(c19, StatisticRecord.ET_NET, `${this.getName()}|RequestB`, 'init');
            }
            let k19 = new LetterPacker(this.isEncrypt);
            let l19 = new Letter(this.buildEnvelop(c19), this.buildBody(c19, d19, this.buildAction()));
            if (this.needStatic()) {
                StatisticManager.putAction(c19, StatisticRecord.ET_NET, `${this.getName()}|RequestB`, 'sendLetter');
            }
            let m19 = await k19.packet(l19, this.isUpGzip);
            if (this.needStatic()) {
                StatisticManager.putAction(c19, StatisticRecord.ET_NET, `${this.getName()}|RequestB`, 'packet');
            }
            let n19 = this.buildHeaders(m19?.getIsGzip() ?? true, d19);
            let o19 = http.createHttp();
            let p19 = http.RequestMethod.GET;
            if (m19?.getBytes() != null && m19?.getBytes().length > 0) {
                p19 = http.RequestMethod.POST;
                n19[HTTP_HEADER_CONTENT_TYPE_H] = "application/octet-stream;binary/octet-stream";
                n19[HTTP_HEADER_ACCEPT_CHARSET] = "UTF-8";
                n19[HTTP_HEADER_CONNECTION] = "Keep-Alive";
                n19[HTTP_HEADER_KEEP_ALIVE] = "timeout=180, max=100";
            }
            n19['User-Agent'] = 'msp';
            let q19 = true;
            o19.once("headersReceive", (y19) => {
                let z19 = y19;
                let a20 = z19[HTTP_HEADER_MSP_GZIP];
                q19 = a20 == "true";
            });
            o19.request(e19, {
                method: p19,
                header: n19,
                extraData: m19?.getBytes().buffer,
                expectDataType: http.HttpDataType.ARRAY_BUFFER,
                usingCache: true,
                priority: 1,
                connectTimeout: 20 * 1000,
                readTimeout: 30 * 1000,
            }, async (t19, u19) => {
                if (t19) {
                    if (this.needStatic()) {
                        StatisticManager.putErrorWithRes(c19, StatisticRecord.ET_NET, `${this.getName()}|RequestE`, t19, `${t19.code}`);
                    }
                    LogUtils.e(GlobalConstants.GENERAL_TAG, `${this.getName()} request error` + t19.message);
                    i19(t19);
                    o19.destroy();
                    return;
                }
                let v19 = u19.result;
                let w19 = await k19.unPacket(new PackInfo(q19, new Uint8Array(v19)));
                if (this.needStatic()) {
                    StatisticManager.putAction(c19, StatisticRecord.ET_NET, `${this.getName()}|RequestB`, 'unPacket');
                }
                if (w19 != null) {
                    let x19 = this.updatePublicKey(w19.getEnvelop());
                    if (x19 && f19) {
                        w19 = await this.doRequest(c19, d19, e19, false);
                    }
                }
                if (w19) {
                    LogUtils.d(GlobalConstants.GENERAL_TAG, `${this.getName()}|NETWORK resp ok`);
                    if (this.needStatic()) {
                        StatisticManager.putAction(c19, StatisticRecord.ET_NET, `${this.getName()}|RequestR`, 'Letter');
                    }
                    h19(w19);
                }
                else {
                    LogUtils.e(GlobalConstants.GENERAL_TAG, `${this.getName()}|NETWORK resp error`);
                    if (this.needStatic()) {
                        StatisticManager.putAction(c19, StatisticRecord.ET_NET, `${this.getName()}|RequestR`, 'ELetter');
                    }
                    h19(new Letter("", ""));
                }
                o19.destroy();
            });
        });
    }
    updatePublicKey(x18) {
        if (isEmpty(x18)) {
            return false;
        }
        let y18 = JSON.parse(x18);
        let z18 = y18[LETTER_DATA];
        if (z18 == null) {
            return false;
        }
        let a19 = z18[LETTER_PARAMS];
        if (a19 == null) {
            return false;
        }
        let b19 = a19[LETTER_PUBLIC_KEY];
        if (b19 == null) {
            return false;
        }
        if (!isEmpty(b19)) {
            MspConfig.setRsaPublicKey(b19);
            return true;
        }
        return false;
    }
}
