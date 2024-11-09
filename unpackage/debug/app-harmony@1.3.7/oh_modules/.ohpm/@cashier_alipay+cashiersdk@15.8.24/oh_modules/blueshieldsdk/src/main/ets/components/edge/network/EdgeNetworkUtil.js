import { collectAtomicData } from '../../collect/Index';
import { BlueShieldManager } from '../../BlueShieldManager';
export class EdgeNetworkUtil {
    static async executeUpdateRPC(b9) {
        try {
            let d9 = '@alipay/network';
            let e9 = await import(d9);
            let f9 = e9.RpcServiceFactory.getSimpleRpcService();
            let g9 = new Map();
            return await new Promise(async (i9, j9) => {
                let k9 = JSON.parse(b9);
                if (null === k9) {
                    i9(null);
                }
                k9['appName'] = await collectAtomicData('HA1');
                k9['appVersion'] = await collectAtomicData('HA2');
                k9['osType'] = 'harmony';
                k9['osVersion'] = await collectAtomicData('HE12');
                k9['brand'] = await collectAtomicData('HE5');
                k9['model'] = await collectAtomicData('HE10');
                let l9 = BlueShieldManager.getInstance().getModule(16);
                let m9 = l9.getTokenResult();
                k9['apdid'] = m9.apdid;
                k9['apdidToken'] = m9.apdidToken;
                let n9 = new Map();
                let o9 = await collectAtomicData('HC5');
                n9['currUserId'] = o9 === null ? '' : o9;
                k9['extData'] = JSON.stringify(n9);
                f9.executeRPCJson(EdgeNetworkUtil.updateOpType, g9, k9, {
                    onSuccess: (q9) => {
                        i9(q9.responseBodyStr);
                    },
                    onError: (p9) => {
                        i9("{\"success\":true,\"flag\":1,\"extData\":\"{\\\"edgeStrategyPackConfig\\\":\\\"{\\\\\\\"version\\\\\\\":\\\\\\\"91\\\\\\\",\\\\\\\"full\\\\\\\":\\\\\\\"https://gw.alipayobjects.com/os/tscentermng/vtfXYNUvJMnrvZsqOKCd.\\\\\\\"}\\\"}\"}");
                        console.log('executeRPCJson failed: ' + p9.rpcException);
                        i9(null);
                    }
                });
            });
        }
        catch (c9) {
            return "{\"success\":true,\"flag\":1,\"extData\":\"{\\\"edgeStrategyPackConfig\\\":\\\"{\\\\\\\"version\\\\\\\":\\\\\\\"91\\\\\\\",\\\\\\\"full\\\\\\\":\\\\\\\"https://gw.alipayobjects.com/os/tscentermng/vtfXYNUvJMnrvZsqOKCd.\\\\\\\"}\\\"}\"}";
            console.log('executeUpdateRPC exception: ' + c9);
            return null;
        }
    }
}
EdgeNetworkUtil.updateOpType = 'alipay.security.edge.data.common.report';
