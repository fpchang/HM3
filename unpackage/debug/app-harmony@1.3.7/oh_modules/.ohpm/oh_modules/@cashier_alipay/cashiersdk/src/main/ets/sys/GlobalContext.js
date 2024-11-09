import { UTDevice } from '@taobao-ohos/utdid_sdk';
import { MspConfig } from '../data/MspConfig';
export class GlobalContext {
    constructor() {
    }
    static getInstance() {
        if (!GlobalContext.instance) {
            GlobalContext.instance = new GlobalContext();
        }
        return GlobalContext.instance;
    }
    getConfig() {
        return MspConfig.getInstance();
    }
    getUtdid(d28) {
        return UTDevice.getUtdid(d28);
    }
}
