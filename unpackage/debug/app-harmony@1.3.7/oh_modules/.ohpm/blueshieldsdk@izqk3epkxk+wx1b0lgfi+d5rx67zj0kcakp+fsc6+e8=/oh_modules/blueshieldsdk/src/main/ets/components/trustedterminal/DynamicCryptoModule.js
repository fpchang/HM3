import { ScpInvokeNative } from 'libblueshield.so';
import util from "@ohos.util";
export class DynamicCryptoModule {
    encrypt(y11) {
        let z11 = ScpInvokeNative(0x12bab582);
        if (z11 != 0) {
            throw new Error('Method not init.');
        }
        let a12 = ScpInvokeNative(0xdbc5a79d, y11);
        return a12;
    }
    encryptStringBase64(v11) {
        let w11 = new util.TextEncoder().encodeInto(v11);
        let x11 = this.encrypt(w11);
        return new util.Base64Helper().encodeToStringSync(x11);
    }
    decrypt(s11) {
        let t11 = ScpInvokeNative(0x12bab582);
        if (t11 != 0) {
            throw new Error('Method not init.');
        }
        let u11 = ScpInvokeNative(0x953d4bf6, s11);
        return u11;
    }
    decryptStringBase64(o11) {
        let p11 = new util.Base64Helper().decodeSync(o11);
        let q11 = this.decrypt(p11);
        let r11 = util.TextDecoder.create("utf-8").decodeWithStream(q11);
        return r11;
    }
}
