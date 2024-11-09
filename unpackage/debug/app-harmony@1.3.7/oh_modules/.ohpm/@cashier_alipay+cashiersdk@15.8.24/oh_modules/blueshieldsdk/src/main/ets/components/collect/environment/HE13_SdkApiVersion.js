import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class SdkApiVersion extends CollectBase {
    constructor() {
        super();
        this.name = 'HE13';
    }
    doCollect() {
        return deviceInfo.sdkApiVersion;
    }
}
export default new SdkApiVersion();
