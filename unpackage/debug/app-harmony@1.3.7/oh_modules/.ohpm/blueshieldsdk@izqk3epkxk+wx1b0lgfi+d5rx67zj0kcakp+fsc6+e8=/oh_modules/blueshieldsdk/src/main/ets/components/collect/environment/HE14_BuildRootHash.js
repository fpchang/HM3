import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class BuildRootHash extends CollectBase {
    constructor() {
        super();
        this.name = 'HE14';
    }
    doCollect() {
        return deviceInfo.buildRootHash;
    }
}
export default new BuildRootHash();
