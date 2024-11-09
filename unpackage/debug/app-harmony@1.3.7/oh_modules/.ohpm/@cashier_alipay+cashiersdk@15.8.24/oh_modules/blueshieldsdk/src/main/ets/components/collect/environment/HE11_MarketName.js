import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class MarketName extends CollectBase {
    constructor() {
        super();
        this.name = 'HE11';
    }
    doCollect() {
        return deviceInfo.marketName;
    }
}
export default new MarketName();
