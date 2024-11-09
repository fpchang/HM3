import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class HardwareModel extends CollectBase {
    constructor() {
        super();
        this.name = 'HE4';
    }
    doCollect() {
        return deviceInfo.hardwareModel;
    }
}
export default new HardwareModel();
