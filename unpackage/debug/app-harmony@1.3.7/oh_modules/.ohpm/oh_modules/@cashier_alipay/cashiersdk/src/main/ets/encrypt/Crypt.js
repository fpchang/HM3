import cryptoFramework from "@ohos.security.cryptoFramework";
import { BASE64Helper } from '../utils/BASE64Helper';
import { stringToUint8ArrayWithEncoder } from '../utils/Utils';
import { LogUtils } from '../utils/LogUtils';
export class Crypt {
    static async encryptRSA2048(p15, q15) {
        return new Promise((s15, t15) => {
            let u15 = cryptoFramework.createAsyKeyGenerator('RSA2048');
            let v15 = new BASE64Helper().decode(q15);
            let w15 = new Uint8Array(v15);
            u15.convertKey({ data: w15 }, null).then(async (a16) => {
                let b16 = cryptoFramework.createCipher("RSA2048|PKCS1");
                await b16.init(cryptoFramework.CryptoMode.ENCRYPT_MODE, a16.pubKey, null);
                let c16 = { data: stringToUint8ArrayWithEncoder(p15) };
                let d16 = await b16.doFinal(c16);
                s15(d16.data);
            }).catch((z15) => {
                LogUtils.e('Crypt', 'encryptKeyRSA2048: ' + z15.message);
                t15(z15);
            });
        });
    }
    static async encrypt3DES192(z14, a15) {
        return new Promise((c15, d15) => {
            let e15 = Crypt.genIVParamsSpec();
            let f15 = cryptoFramework.createSymKeyGenerator('3DES192');
            let g15 = { data: stringToUint8ArrayWithEncoder(z14) };
            f15.convertKey(g15).then(async (k15) => {
                let l15 = cryptoFramework.CryptoMode.ENCRYPT_MODE;
                let m15 = cryptoFramework.createCipher('3DES192|CBC|PKCS7');
                await m15.init(l15, k15, e15);
                let n15 = { data: a15 };
                let o15 = await m15.doFinal(n15);
                c15(o15.data);
            }).catch((j15) => {
                LogUtils.e('Crypt', 'encrypt3DES192: ' + j15.message);
                d15(j15);
            });
        });
    }
    static async decrypt3DES192(j14, k14) {
        return new Promise((m14, n14) => {
            let o14 = Crypt.genIVParamsSpec();
            let p14 = cryptoFramework.createSymKeyGenerator('3DES192');
            let q14 = { data: stringToUint8ArrayWithEncoder(j14) };
            p14.convertKey(q14).then(async (u14) => {
                let v14 = cryptoFramework.CryptoMode.DECRYPT_MODE;
                let w14 = cryptoFramework.createCipher('3DES192|CBC|PKCS7');
                await w14.init(v14, u14, o14);
                let x14 = { data: k14 };
                let y14 = await w14.doFinal(x14);
                m14(y14.data);
            }).catch((t14) => {
                LogUtils.e('Crypt', 'decrypt3DES192: ' + t14.message);
                n14(t14);
            });
        });
    }
    static genIVParamsSpec() {
        let f14 = [0, 0, 0, 0, 0, 0, 0, 0];
        let g14 = new Uint8Array(f14);
        let h14 = { data: g14 };
        let i14 = {
            iv: h14,
            algName: "IvParamsSpec"
        };
        return i14;
    }
}
