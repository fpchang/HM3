import buffer from "@ohos.buffer";
import uri from "@ohos.uri";
import util from "@ohos.util";
import hilog from "@ohos.hilog";
import cryptoFramework from "@ohos.security.cryptoFramework";
import BuildProfile from '../../../../BuildProfile';
export function formatResult(o36) {
    let p36 = o36.split(";");
    let q36 = new Map();
    let r36 = "";
    for (let s36 of p36) {
        let t36 = s36.indexOf("={");
        r36 = s36.substring(0, t36);
        q36.set(r36, getValue(s36, r36));
    }
    return q36;
}
export function isEmpty(n36) {
    return n36 === null || n36 === undefined || n36.length === 0;
}
function getValue(k36, l36) {
    let m36 = l36 + "={";
    return k36.substring(k36.indexOf(m36) + m36.length, k36.lastIndexOf("}"));
}
export function getRandomString(g36) {
    let h36 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let i36 = "";
    for (let j36 = 0; j36 < g36; j36++) {
        i36 += h36.charAt(Math.floor(Math.random() * h36.length));
    }
    return i36;
}
export function stringToUint8ArrayWithEncoder(e36) {
    let f36 = util.TextEncoder.create('utf-8');
    return f36.encode(e36);
}
export function uint8ArrayToStringWithDecoder(c36) {
    let d36 = util.TextDecoder.create('utf-8');
    return d36.decode(c36);
}
export function formatNumber(z35, a36) {
    let b36 = z35.toString();
    while (b36.length < a36) {
        b36 = "0" + b36;
    }
    return b36;
}
export function debug(x35, y35) {
    if (BuildProfile.DEBUG) {
        hilog.debug(0, "alipay_sdk", `${x35}: ${y35}`);
    }
}
export function getQueryMap(r35) {
    let s35 = new uri.URI(r35);
    let t35 = new Map();
    let u35 = s35.query.split("&");
    for (let v35 of u35) {
        let w35 = v35.split("=");
        t35.set(w35[0], w35[1]);
    }
    return t35;
}
export function getProcessUid(q35) {
    return q35.applicationInfo.uid;
}
export function elapsedRealtime() {
    return Date.now();
}
export async function doLoopSHA256(g35) {
    let h35 = "SHA256";
    let i35 = cryptoFramework.createMd(h35);
    let j35 = g35;
    let k35 = new Uint8Array(buffer.from(j35, 'utf-8').buffer);
    let l35 = 64;
    for (let n35 = 0; n35 < k35.length; n35 += l35) {
        let o35 = k35.subarray(n35, n35 + l35);
        let p35 = { data: o35 };
        await i35.update(p35);
    }
    let m35 = await i35.digest();
    return bufferToHex(m35.data);
}
function bufferToHex(d35) {
    return Array.from(d35)
        .map(f35 => f35.toString(16).padStart(2, '0'))
        .join('');
}
