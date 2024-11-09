import { ScpInvokeNative } from 'libblueshield.so';
import util from "@ohos.util";
export class SafeSignatureModule {
    sign(o14, p14, q14) {
        return this.signInternal(o14, p14, null, q14, false);
    }
    signString(i14, j14, k14) {
        let l14 = new util.TextEncoder().encodeInto(k14);
        let m14 = this.signInternal(i14, j14, null, l14, true);
        let n14 = util.TextDecoder.create("utf-8").decodeWithStream(m14);
        return n14;
    }
    signInternal(c14, d14, e14, f14, g14) {
        let h14 = ScpInvokeNative(0xfcba7299, c14, d14, e14, f14, g14);
        return h14;
    }
}
