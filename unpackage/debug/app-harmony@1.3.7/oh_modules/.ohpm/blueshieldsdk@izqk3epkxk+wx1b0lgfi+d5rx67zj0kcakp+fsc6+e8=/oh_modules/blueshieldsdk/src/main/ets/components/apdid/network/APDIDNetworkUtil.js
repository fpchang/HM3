import BuildProfile from '../../../../../../BuildProfile';
import http from '@ohos.net.http';
const USE_ANT_NETWORK_LIB = BuildProfile.USE_ANT_NETWORK_LIB;
export class APDIDNetworkUtil {
    static packetStr(s1) {
        if (s1.startsWith("[") && s1.endsWith("]")) {
        }
        else {
            s1 = "[" + s1 + "]";
        }
        return s1;
    }
    static async executeRPC(w) {
        if (USE_ANT_NETWORK_LIB) {
            try {
                let i1 = '@alipay/network';
                let j1 = await import(i1);
                let k1 = j1.RpcServiceFactory.getSimpleRpcService();
                let l1 = new Map();
                return new Promise((n1, o1) => {
                    const p1 = JSON.parse(w);
                    if (null === p1 || null === k1) {
                        n1(null);
                    }
                    k1.executeRPCJson(APDIDNetworkUtil.operationType, l1, p1, {
                        onSuccess: (r1) => {
                            n1(r1.responseBodyStr);
                        },
                        onError: (q1) => {
                            console.log('executeRPCJson failed: ' + q1.rpcException);
                            n1(null);
                        }
                    });
                });
            }
            catch (h1) {
                console.log('executeRPC exception: ' + h1);
                return null;
            }
        }
        else {
            return await new Promise((y, z) => {
                let a1 = http.createHttp();
                const b1 = APDIDNetworkUtil.packetStr(w);
                a1.request('https://mobilegw.alipay.com/mgw.htm', {
                    method: http.RequestMethod.POST,
                    header: {
                        'Content-Type': 'application/json',
                        'Operation-Type': 'alipay.security.device.data.report.harmony.https.v7',
                    },
                    extraData: b1,
                    priority: 1,
                    connectTimeout: 30000,
                    readTimeout: 30000,
                }, (d1, e1) => {
                    if (!d1) {
                        let f1 = JSON.stringify(e1.responseCode);
                        let g1 = e1.result;
                        (typeof g1 === 'string') ? y(g1) : y(null);
                        a1.destroy();
                    }
                    else {
                        console.log('httpRequest failed: ' + d1);
                        y(null);
                        a1.destroy();
                    }
                });
            });
        }
    }
}
APDIDNetworkUtil.operationType = 'alipay.security.device.data.report.harmony.v7';
