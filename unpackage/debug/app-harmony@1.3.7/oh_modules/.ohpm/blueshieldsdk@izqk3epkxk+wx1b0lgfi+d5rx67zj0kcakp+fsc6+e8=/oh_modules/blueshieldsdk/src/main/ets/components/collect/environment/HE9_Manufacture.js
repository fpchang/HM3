import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class Manufacture extends CollectBase {
    constructor() {
        super();
        this.name = 'HE9';
    }
    doCollect() {
        return deviceInfo.manufacture;
    }
}
export default new Manufacture();
