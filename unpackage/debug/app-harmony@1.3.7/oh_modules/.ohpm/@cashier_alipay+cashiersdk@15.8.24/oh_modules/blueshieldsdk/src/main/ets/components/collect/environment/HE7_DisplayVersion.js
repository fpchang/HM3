import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class DisplayVersion extends CollectBase {
    constructor() {
        super();
        this.name = 'HE7';
    }
    doCollect() {
        return deviceInfo.displayVersion;
    }
}
export default new DisplayVersion();
