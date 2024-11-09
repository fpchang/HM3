import { GZip } from '../../encrypt/GZip';
import { formatNumber, getRandomString, isEmpty, stringToUint8ArrayWithEncoder, uint8ArrayToStringWithDecoder } from '../../utils/Utils';
import { Letter } from './Letter';
import { GlobalConstants } from '../../const/GlobalConstants';
import { Crypt } from '../../encrypt/Crypt';
import { LogUtils } from '../../utils/LogUtils';
export class PackInfo {
    constructor(v18, w18) {
        this.isGzip = v18;
        this.bytes = w18;
    }
    getIsGzip() {
        return this.isGzip;
    }
    getBytes() {
        return this.bytes;
    }
}
export class LetterPacker {
    constructor(u18) {
        this.isEncrypt = true;
        this.key = '';
        this.isEncrypt = u18;
        this.key = getRandomString(24);
    }
    async packet(m18, n18) {
        if (!m18) {
            return null;
        }
        let o18 = stringToUint8ArrayWithEncoder(m18.getEnvelop());
        let p18 = stringToUint8ArrayWithEncoder(m18.getBody());
        if (n18) {
            try {
                p18 = GZip.toGzip(p18);
            }
            catch (t18) {
                n18 = false;
            }
        }
        let q18 = null;
        if (this.isEncrypt) {
            let r18 = await Crypt.encryptRSA2048(this.key, GlobalConstants.RSA_PUBLIC_KEY);
            let s18 = await Crypt.encrypt3DES192(this.key, p18);
            q18 = this.packetMulti(o18, r18, s18);
        }
        else {
            q18 = this.packetMulti(o18, p18);
        }
        return new PackInfo(n18, q18);
    }
    packetMulti(...f18) {
        let g18 = 0;
        for (let l18 of f18) {
            g18 += 5 + l18.length;
        }
        let h18 = new Uint8Array(g18);
        let i18 = 0;
        for (let j18 of f18) {
            let k18 = stringToUint8ArrayWithEncoder(formatNumber(j18.length, 5));
            h18.set(k18, i18);
            i18 += 5;
            h18.set(j18, i18);
            i18 += j18.length;
        }
        return h18;
    }
    static genIVParamsSpec() {
        let b18 = [0, 0, 0, 0, 0, 0, 0, 0];
        let c18 = new Uint8Array(b18);
        let d18 = { data: c18 };
        let e18 = {
            iv: d18,
            algName: "IvParamsSpec"
        };
        return e18;
    }
    async unPacket(s17) {
        let t17 = "";
        let u17 = "";
        let v17 = s17.getBytes().slice(0, 5);
        let w17 = Number.parseInt(uint8ArrayToStringWithDecoder(v17), 10);
        let x17 = s17.getBytes().slice(5, 5 + w17);
        t17 = uint8ArrayToStringWithDecoder(x17);
        let y17 = s17.getBytes().slice(5 + w17, 5 + w17 + 5);
        let z17 = Number.parseInt(uint8ArrayToStringWithDecoder(y17), 10);
        if (z17 > 0) {
            let a18 = s17.getBytes().slice(5 + w17 + 5, 5 + w17 + 5 + z17);
            if (this.isEncrypt) {
                a18 = await Crypt.decrypt3DES192(this.key, a18);
            }
            if (s17.getIsGzip()) {
                a18 = GZip.unGzip(a18);
            }
            u17 = uint8ArrayToStringWithDecoder(a18);
        }
        if (isEmpty(t17) && isEmpty(u17)) {
            LogUtils.e('LetterPacker', 'envelop or body is empty');
            return null;
        }
        return new Letter(t17, u17);
    }
}
