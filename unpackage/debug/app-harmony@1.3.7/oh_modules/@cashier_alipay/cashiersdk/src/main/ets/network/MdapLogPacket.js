import { GlobalConstants } from '../const/GlobalConstants';
import { GZip } from '../encrypt/GZip';
import { GlobalContext } from '../sys/GlobalContext';
import { LogUtils } from '../utils/LogUtils';
import { stringToUint8ArrayWithEncoder, uint8ArrayToStringWithDecoder } from '../utils/Utils';
import { Letter } from './model/Letter';
import { HTTP_HEADER_ACCEPT_CHARSET, HTTP_HEADER_BIZ_CODE, HTTP_HEADER_CONNECTION, HTTP_HEADER_CONTENT_ENCODING, HTTP_HEADER_CONTENT_TYPE_H, HTTP_HEADER_KEEP_ALIVE, HTTP_HEADER_LOG_HEADER, HTTP_HEADER_MSP_GZIP, HTTP_HEADER_PRODUCT_ID, HTTP_HEADER_PRODUCT_VERSION, HTTP_HEADER_USER_AGENT, HTTP_HEADER_UTDID, NetworkTask } from './NetworkTask';
import http from "@ohos.net.http";
import BuildProfile from '../../../../BuildProfile';
export class MdapLogPacket extends NetworkTask {
    buildHeaders(m17, n17) {
        return new Map();
    }
    buildAction() {
        return {};
    }
    isWifiMocked() {
        return false;
    }
    buildBody(j17, k17, l17) {
        return k17;
    }
    getName() {
        return "dap";
    }
    request(o16, p16) {
        return new Promise((r16, s16) => {
            LogUtils.i(GlobalConstants.GENERAL_TAG, "mdap post");
            let t16 = GZip.toGzip(stringToUint8ArrayWithEncoder(p16));
            let u16 = new Map();
            u16[HTTP_HEADER_UTDID] = GlobalContext.getInstance().getUtdid(o16.getSafeContext());
            u16[HTTP_HEADER_LOG_HEADER] = "RAW";
            u16[HTTP_HEADER_BIZ_CODE] = "alipaysdk";
            u16[HTTP_HEADER_PRODUCT_ID] = "alipaysdk_android";
            u16[HTTP_HEADER_CONTENT_ENCODING] = "Gzip";
            u16[HTTP_HEADER_PRODUCT_VERSION] = BuildProfile.HAR_VERSION;
            u16[HTTP_HEADER_CONTENT_TYPE_H] = "application/octet-stream;binary/octet-stream";
            u16[HTTP_HEADER_ACCEPT_CHARSET] = "UTF-8";
            u16[HTTP_HEADER_CONNECTION] = "Keep-Alive";
            u16[HTTP_HEADER_KEEP_ALIVE] = "timeout=180, max=100";
            u16[HTTP_HEADER_USER_AGENT] = 'msp';
            let v16 = http.createHttp();
            let w16 = http.RequestMethod.POST;
            let x16 = true;
            v16.once("headersReceive", (g17) => {
                let h17 = g17;
                let i17 = h17[HTTP_HEADER_MSP_GZIP];
                x16 = i17 == "true";
            });
            v16.request(GlobalConstants.MDAP_LG_URL, {
                method: w16,
                header: u16,
                extraData: t16.buffer,
                expectDataType: http.HttpDataType.ARRAY_BUFFER,
                usingCache: true,
                priority: 1,
                connectTimeout: 20 * 1000,
                readTimeout: 30 * 1000,
            }, async (a17, b17) => {
                if (a17) {
                    LogUtils.printExceptionStackTrace(a17);
                    return s16(a17);
                }
                let c17 = "";
                try {
                    let e17 = b17.result;
                    if (x16) {
                        let f17 = GZip.unGzip(new Uint8Array(e17));
                        c17 = uint8ArrayToStringWithDecoder(f17);
                    }
                    else {
                        c17 = uint8ArrayToStringWithDecoder(new Uint8Array(e17));
                    }
                }
                catch (d17) {
                    LogUtils.printExceptionStackTrace(d17);
                    r16(null);
                }
                LogUtils.i(GlobalConstants.GENERAL_TAG, `mdap post success ${c17}`);
                r16(new Letter("", c17));
            });
        });
    }
}
