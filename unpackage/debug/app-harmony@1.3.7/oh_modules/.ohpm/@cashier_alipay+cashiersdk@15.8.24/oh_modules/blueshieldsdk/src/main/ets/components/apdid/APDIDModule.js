import { TokenResult } from './IAPDIDModule';
import taskpool from '@ohos.taskpool';
import { ScpInvokeNative } from 'libblueshield.so';
function callNativeInitToken(p) {
    "use concurrent";
    let q = new TokenResult();
    try {
        let s = p.get("userId");
        let t = p.get("tid");
        let u = ScpInvokeNative(0x5927b2ea, '', typeof s === 'string' ? s : '', typeof t === 'string' ? t : '');
        let v = JSON.parse(u);
        q.apdidToken = v['apdidToken'];
        q.apdid = v['apdid'];
    }
    catch (r) {
        console.log(r);
    }
    return q;
}
export class APDIDModule {
    initToken(i, j) {
        let k = 'Tbi34So35OEGGChrT+jUdAdXkw6nDJtzSHC+dec6QPAREb5ZjQEAAA==';
        let l = new TokenResult();
        l.apdidToken = k;
        let m = new TokenResult();
        return taskpool.execute(callNativeInitToken, i).then((o) => {
            m = o;
            if (j != undefined) {
                j(null, m);
                return;
            }
            else {
                return m;
            }
        });
    }
    getTokenResult() {
        let e = new TokenResult();
        try {
            let g = ScpInvokeNative(0x7a8c5932);
            let h = JSON.parse(g);
            e.apdidToken = h['apdidToken'];
            e.apdid = h['apdid'];
        }
        catch (f) {
            console.log(f);
        }
        return e;
    }
    getApdidToken() {
        throw new Error('Method not implemented.');
    }
    initOpenToken(b, c, d) {
        throw new Error('Method not implemented.');
    }
    registerDeviceIdChanged(a) {
        throw new Error('Method not implemented.');
    }
}
