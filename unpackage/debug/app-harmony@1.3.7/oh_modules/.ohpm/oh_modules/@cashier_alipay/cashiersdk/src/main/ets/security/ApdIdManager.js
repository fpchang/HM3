import { BlueShieldManager } from 'blueshieldsdk';
import { TidStorage } from '../tid/TidStorage';
import { GlobalContext } from '../sys/GlobalContext';
import { LogUtils } from '../utils/LogUtils';
export class ApdIdManager {
    constructor() {
    }
    static getInstance() {
        if (!ApdIdManager.instance) {
            ApdIdManager.instance = new ApdIdManager();
        }
        return ApdIdManager.instance;
    }
    async init(p22) {
        if (this.apdIdToken) {
            return this.apdIdToken;
        }
        try {
            BlueShieldManager.setContext(p22);
            BlueShieldManager.getInstance().initialize();
            this.apdIdModule = BlueShieldManager.getInstance().getModule(16);
            return await this.initToken(p22);
        }
        catch (q22) {
            LogUtils.e('ApdIdManager', `ApdIdManager init error ${q22.message}`);
        }
        return '';
    }
    async initToken(g22) {
        return new Promise((i22, j22) => {
            let k22 = new Map();
            k22.set("tid", TidStorage.getInstance().getTid());
            k22.set("utdid", GlobalContext.getInstance().getUtdid(g22));
            this.apdIdModule?.initToken(k22).then((o22) => {
                LogUtils.d('ApdIdManager', 'ApdIdManager initToken success apdidToken: ' + o22.apdidToken);
                this.apdIdToken = o22.apdidToken;
                i22(o22.apdidToken);
            }).catch((n22) => {
                LogUtils.e('ApdIdManager', `ApdIdManager initToken error ${n22.message}`);
                i22('');
            });
        });
    }
    getToken() {
        if (this.apdIdToken) {
            return this.apdIdToken;
        }
        return this.apdIdModule?.getTokenResult().apdidToken;
    }
}
