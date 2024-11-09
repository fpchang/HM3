import { CollectBase } from '../CollectBase';
import radio from '@ohos.telephony.radio';
class NetworkType extends CollectBase {
    constructor() {
        super();
        this.name = 'HD19';
    }
    doCollect() {
        return radio.getNetworkState().then((b5) => {
            return b5.cfgTech;
        });
    }
}
export default new NetworkType();
