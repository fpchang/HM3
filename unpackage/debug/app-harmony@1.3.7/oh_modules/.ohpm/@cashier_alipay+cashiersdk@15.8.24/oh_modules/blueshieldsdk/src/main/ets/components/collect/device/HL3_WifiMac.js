import { CollectBase } from '../CollectBase';
import wifiManager from '@ohos.wifiManager';
class WifiMac extends CollectBase {
    constructor() {
        super();
        this.name = 'HL3';
    }
    doCollect() {
        return wifiManager.getLinkedInfo().then(t5 => {
            return t5.bssid;
        });
    }
}
export default new WifiMac();
