import { DynamicConfigPacket } from '../network/DynamicConfigPacket';
import { LogUtils } from '../utils/LogUtils';
import { PreferenceUtils } from '../utils/PreferenceUtils';
export class DynamicConfig {
    constructor() {
        this.initLocalConfig();
    }
    static getInstance() {
        if (!DynamicConfig.instance) {
            DynamicConfig.instance = new DynamicConfig();
        }
        return DynamicConfig.instance;
    }
    async updateSync(f10, g10) {
        let h10 = new DynamicConfigPacket();
        let i10 = await h10.request(f10, "");
        if (i10) {
            this.parse(i10.getBody());
            PreferenceUtils.getInstance().put(DynamicConfig.DYNAMIC_CONFIG, i10.getBody());
        }
    }
    parse(b10) {
        try {
            let d10 = JSON.parse(b10);
            let e10 = d10.st_sdk_config;
            LogUtils.d("DynamicConfig", `parse success: ${JSON.stringify(e10)}`);
        }
        catch (c10) {
            LogUtils.w("DynamicConfig", `parse error: ${c10}`);
        }
    }
    initLocalConfig() {
        let a10 = PreferenceUtils.getInstance().get(DynamicConfig.DYNAMIC_CONFIG, "{}");
        if (a10) {
            this.parse(a10);
        }
    }
}
DynamicConfig.DYNAMIC_CONFIG = "alipay_cashier_dynamic_config";
