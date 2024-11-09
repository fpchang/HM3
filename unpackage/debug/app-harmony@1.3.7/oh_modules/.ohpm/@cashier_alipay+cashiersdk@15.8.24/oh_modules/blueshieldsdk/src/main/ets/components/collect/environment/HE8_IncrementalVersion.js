import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class IncrementalVersion extends CollectBase {
    constructor() {
        super();
        this.name = 'HE8';
    }
    doCollect() {
        return deviceInfo.incrementalVersion;
    }
}
export default new IncrementalVersion();
