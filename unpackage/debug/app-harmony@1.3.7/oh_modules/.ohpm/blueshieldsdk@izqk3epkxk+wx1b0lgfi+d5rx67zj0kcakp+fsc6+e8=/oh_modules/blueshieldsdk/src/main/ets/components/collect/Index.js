import cryptoFramework from '@ohos.security.cryptoFramework';
import buffer from '@ohos.buffer';
import { CollectBase } from './CollectBase';
import { HD_STATIC, HD_DYNAMIC } from './device/Index';
import { HA_STATIC } from './application/Index';
import { HE_STATIC, HE_DYNAMIC } from './environment/Index';
import { HC_STATIC, HC_DYNAMIC } from './customize/Index';
const staticSources = [...HD_STATIC, ...HA_STATIC, ...HE_STATIC, ...HC_STATIC];
const dynamicSources = [...HD_DYNAMIC, ...HE_DYNAMIC, ...HC_DYNAMIC];
async function collectDataInner(q6, r6) {
    let s6 = [];
    for (const x6 of r6) {
        if (x6 instanceof CollectBase) {
            s6.push(x6.getResult(q6));
        }
    }
    let t6 = await Promise.all(s6);
    let u6 = {};
    for (let v6 of t6) {
        for (let w6 of Object.entries(v6)) {
            u6[w6[0]] = w6[1];
        }
    }
    return u6;
}
async function collectStaticData(p6) {
    return collectDataInner(p6, staticSources);
}
async function collectDynamicData(o6) {
    return collectDataInner(o6, dynamicSources);
}
export async function generateStaticDataHash(c6) {
    let d6 = await collectStaticData(c6);
    let e6 = [];
    let f6 = cryptoFramework.createMd('SHA1');
    for (let l6 of Object.entries(d6)) {
        let m6 = `${l6[0]}=${l6[1]}`;
        let n6 = { data: new Uint8Array(buffer.from(m6, 'utf-8').buffer) };
        await f6.update(n6);
    }
    let g6 = await f6.digest();
    let h6 = g6.data;
    const i6 = Array.from(h6).map(k6 => k6.toString(16).padStart(2, '0')).join('');
    return i6;
}
export async function collectAllData(z5) {
    let a6 = [...staticSources, ...dynamicSources];
    let b6 = await collectDataInner(z5, a6);
    return JSON.stringify(b6);
}
export async function collectAtomicData(v5) {
    let w5 = [...staticSources, ...dynamicSources];
    let x5 = '';
    for (let y5 of w5) {
        if (y5.name === v5) {
            x5 = await y5.doCollect();
        }
    }
    return `${x5}`;
}
