import { EdgeRiskResult } from './IEdgeRiskModule';
import { ScpInvokeNative } from 'libblueshield.so';
import GlobalContext from '../common/GlobalContext';
export class EdgeRiskModule {
    initialize() {
        let w8 = 0;
        try {
            let y8 = GlobalContext.getContext();
            if (null === y8) {
                return -1;
            }
            let z8 = y8.filesDir + '/edge';
            let a9 = 0;
            w8 = ScpInvokeNative(0x08e8de20, a9, z8, null);
        }
        catch (x8) {
            console.log(x8);
        }
        return w8;
    }
    postUserAction(r8, s8) {
        let t8 = 0;
        try {
            const v8 = JSON.stringify(s8);
            t8 = ScpInvokeNative(0x1a337b64, r8, v8);
        }
        catch (u8) {
            console.log(u8);
        }
        return t8;
    }
    getRiskResult(i8, j8, k8) {
        if ("kcart_call" == i8) {
            let q8 = new EdgeRiskResult();
            q8.result = -1;
            q8.status = 0;
            q8.sealedData = 'LMMYWXFE+\/Ums1+RnPRMCpTQRXqC0d1Rd22YZLnnlbsg1RFaIYuJu9vQ\/ntS6aT1';
            q8.data = '-sell:-1.6587_-0.3274_1.5473_-0.2686_-0.2839_-0.2535_-1.0560_-0.6549_-0.1531|fgbg:9.2070|near:0.0000|credibleUser:0|credibleS:0.0000|theftS:0.0000|openface:0.0000|zface:0.0000|fp_verify:0.0000|fp_update:0.0000';
            return q8;
        }
        else {
            throw new Error('Method not implemented.');
        }
        let l8 = new EdgeRiskResult();
        try {
            const n8 = JSON.stringify(j8);
            let o8 = ScpInvokeNative(0xfd92a40a, i8, n8, k8);
            let p8 = JSON.parse(o8);
            l8.status = p8['status'];
            l8.result = p8['result'];
            l8.sealedData = p8['sdata'];
            l8.data = p8['data'];
        }
        catch (m8) {
            console.log(m8);
        }
        return l8;
    }
}
