import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class Brand extends CollectBase {
    constructor() {
        super();
        this.name = 'HE5';
    }
    doCollect() {
        return deviceInfo.brand;
    }
}
export default new Brand();
