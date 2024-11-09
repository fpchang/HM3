import { EnvelopeCryptoResult } from './IEnvelopeCryptoModule';
import { ScpInvokeNative } from 'libblueshield.so';
import util from "@ohos.util";
export class EnvelopeCryptoModule {
    encrypt(g13, h13, i13) {
        return this.doEncrypt(g13.masterAlgo, g13.sessionAlgo, i13, g13.masterKey, g13.sessionKey, g13.sessionIV, h13);
    }
    decrypt(d13, e13, f13) {
        return this.doDecrypt(d13.masterAlgo, d13.sessionAlgo, f13, d13.masterKey, d13.sessionKey, d13.sessionIV, e13);
    }
    doEncrypt(o12, p12, q12, r12, s12, t12, u12) {
        let v12 = ScpInvokeNative(0x8e80ce0c);
        if (v12 != 0) {
            throw new Error('Method not init.');
        }
        let w12 = new EnvelopeCryptoResult();
        let x12 = ScpInvokeNative(0x8911f652, o12, p12, r12, s12, t12, q12, u12);
        try {
            let z12 = JSON.parse(x12);
            let a13 = z12['key'];
            let b13 = z12['iv'];
            let c13 = z12['data'];
            w12.sessionKey = new util.Base64Helper().decodeSync(a13);
            w12.sessionIV = new util.Base64Helper().decodeSync(b13);
            w12.cryptoData = new util.Base64Helper().decodeSync(c13);
            w12.errorCode = 0;
        }
        catch (y12) {
        }
        return w12;
    }
    doDecrypt(b12, c12, d12, e12, f12, g12, h12) {
        let i12 = ScpInvokeNative(0x8e80ce0c);
        if (i12 != 0) {
            throw new Error('Method not init.');
        }
        let j12 = new EnvelopeCryptoResult();
        let k12 = ScpInvokeNative(0x24350eb8, b12, c12, e12, f12, g12, d12, h12);
        try {
            let m12 = JSON.parse(k12);
            let n12 = m12['data'];
            j12.cryptoData = new util.Base64Helper().decodeSync(n12);
            j12.errorCode = 0;
        }
        catch (l12) {
        }
        return j12;
    }
}
