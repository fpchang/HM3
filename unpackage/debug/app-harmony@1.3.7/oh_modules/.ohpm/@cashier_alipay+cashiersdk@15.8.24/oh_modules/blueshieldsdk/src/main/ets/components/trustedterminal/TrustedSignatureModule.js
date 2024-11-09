import { ScpInvokeNative } from 'libblueshield.so';
import util from "@ohos.util";
import { BlueShieldManager } from '../BlueShieldManager';
export class TrustedSignatureModule {
    getSign(k16) {
        let l16 = -1;
        let m16 = new Map();
        do {
            if (null == k16 || undefined == k16) {
                break;
            }
            let n16 = "";
            let o16 = "";
            let p16 = "";
            let q16 = k16.get("signType");
            if (q16 == null) {
                l16 = 401;
                break;
            }
            let r16 = k16.get("appKey");
            if (r16 == null) {
                l16 = 401;
                break;
            }
            let s16 = k16.get("signData");
            if (s16 == null) {
                l16 = 401;
                break;
            }
            let t16 = k16.get("authCode");
            if (q16 == 0 || q16 == 1) {
                let a17 = new util.TextEncoder().encodeInto(s16);
                let b17 = ScpInvokeNative(0x2ae9c3f6, q16, r16, t16, a17);
                m16.set("x-bs-sign", b17);
                try {
                    let d17 = BlueShieldManager.getInstance()
                        .getModule(33);
                    let e17 = new Map();
                    let f17 = d17.getColorLabel("", e17);
                    m16.set("x-bs-color", f17);
                }
                catch (c17) {
                }
                m16.set("x-bs-token", '');
            }
            else if (q16 == 4) {
                let u16 = k16.get("env");
                if (u16 == null) {
                    l16 = 401;
                    break;
                }
                let v16 = k16.get("api");
                if (v16 == null) {
                    l16 = 401;
                    break;
                }
                let w16 = new util.TextEncoder().encodeInto(s16);
                let x16 = ScpInvokeNative(0x87509aad);
                if (1 != x16) {
                    break;
                }
                let y16 = ScpInvokeNative(0xb3c7a91d, q16, u16, v16, r16, p16, w16);
                let z16 = JSON.parse(y16);
                m16.set("x-bs-sign", z16['x-djy-sign']);
                m16.set("x-bs-color", z16['x-djy-color']);
                m16.set("x-bs-token", '');
            }
        } while (false);
        return m16;
    }
}
