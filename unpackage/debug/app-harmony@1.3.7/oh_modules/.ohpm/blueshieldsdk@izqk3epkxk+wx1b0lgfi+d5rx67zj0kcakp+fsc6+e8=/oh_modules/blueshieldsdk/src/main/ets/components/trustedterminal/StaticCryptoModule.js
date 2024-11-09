import { ScpInvokeNative } from 'libblueshield.so';
import util from "@ohos.util";
export class StaticCryptoModule {
    encrypt(d16, e16, f16, g16) {
        return this.doEncrypt(d16, 0, e16, f16, g16);
    }
    decrypt(z15, a16, b16, c16) {
        return this.doDecrypt(z15, 0, a16, b16, c16);
    }
    encryptBase64(v15, w15, x15, y15) {
        return this.doEncrypt(v15, 1, w15, x15, y15);
    }
    decryptBase64(r15, s15, t15, u15) {
        return this.doDecrypt(r15, 1, s15, t15, u15);
    }
    encryptStringBase64(k15, l15, m15, n15) {
        let o15 = new util.TextEncoder().encodeInto(m15);
        let p15 = this.doEncrypt(k15, 1, l15, o15, n15);
        let q15 = util.TextDecoder.create("utf-8").decodeWithStream(p15);
        return q15;
    }
    decryptStringBase64(d15, e15, f15, g15) {
        let h15 = new util.TextEncoder().encodeInto(f15);
        let i15 = this.doDecrypt(d15, 1, e15, h15, g15);
        let j15 = util.TextDecoder.create("utf-8").decodeWithStream(i15);
        return j15;
    }
    doEncrypt(x14, y14, z14, a15, b15) {
        let c15 = ScpInvokeNative(0xda028703, 2, x14, y14, z14, a15);
        return c15;
    }
    doDecrypt(r14, s14, t14, u14, v14) {
        let w14 = ScpInvokeNative(0xda028703, 1, r14, s14, t14, u14);
        return w14;
    }
}
