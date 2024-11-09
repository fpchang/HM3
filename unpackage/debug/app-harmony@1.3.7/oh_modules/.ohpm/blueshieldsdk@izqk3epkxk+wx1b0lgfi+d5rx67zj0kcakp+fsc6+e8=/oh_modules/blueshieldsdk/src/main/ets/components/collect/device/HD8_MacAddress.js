import { CollectBase } from '../CollectBase';
import wifiManager from '@ohos.wifiManager';
class MacAddress extends CollectBase {
    constructor() {
        super();
        this.name = 'HD8';
    }
    doCollect() {
        return wifiManager.getLinkedInfo().then(n5 => {
            return n5.macAddress;
        });
    }
}
export default new MacAddress();
