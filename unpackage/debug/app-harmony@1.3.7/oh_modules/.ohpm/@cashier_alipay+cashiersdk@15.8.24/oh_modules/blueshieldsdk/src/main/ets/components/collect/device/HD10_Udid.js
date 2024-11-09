import { CollectBase } from '../CollectBase';
import deviceinfo from '@ohos.deviceInfo';
class Udid extends CollectBase {
    constructor() {
        super();
        this.name = 'HD10';
    }
    doCollect() {
        let b4 = deviceinfo.udid;
        return b4;
    }
}
export default new Udid();
