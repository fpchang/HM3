import { GlobalContext } from '../sys/GlobalContext';
import { LogUtils } from '../utils/LogUtils';
import { getProcessUid, getRandomString, stringToUint8ArrayWithEncoder } from '../utils/Utils';
import { NetworkTask } from './NetworkTask';
import HashMap from "@ohos.util.HashMap";
import util from "@ohos.util";
import deviceInfo from "@ohos.deviceInfo";
export class DynamicConfigPacket extends NetworkTask {
    getApiVersion() {
        return "5.0.0";
    }
    buildAction() {
        return NetworkTask.buildAction("sdkConfig", 'obtain');
    }
    isWifiMocked() {
        return true;
    }
    getName() {
        return "dcp";
    }
    buildEnvelopInner(l16, m16, n16) {
        n16.setAll(this.generateRequestParams(l16));
        return super.buildEnvelopInner(l16, m16, n16);
    }
    generateRequestParams(g16) {
        const h16 = new HashMap();
        try {
            let j16 = {};
            let k16 = new util.Base64Helper().encodeToStringSync(stringToUint8ArrayWithEncoder(getRandomString(16)));
            j16 = {
                "ap_q": k16,
                "ap_link_token": g16.apLinkToken,
                "u_pd": getProcessUid(g16.getSafeContext()).toString(),
                "u_lk": '0x0000',
                "u_pi": g16.invokeTag,
                "u_fu": GlobalContext.getInstance().getUtdid(g16.getSafeContext()),
                "u_oi": deviceInfo.ODID,
            };
            h16.set("ap_req", j16.toString());
        }
        catch (i16) {
            LogUtils.e("DynamicConfigPacket", `generateRequestParams error ${i16}`);
        }
        return h16;
    }
}
