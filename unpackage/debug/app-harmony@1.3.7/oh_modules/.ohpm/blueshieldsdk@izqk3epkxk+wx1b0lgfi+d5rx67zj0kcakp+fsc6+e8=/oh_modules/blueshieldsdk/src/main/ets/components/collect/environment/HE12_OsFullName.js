import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class OsFullName extends CollectBase {
    constructor() {
        super();
        this.name = 'HE12';
    }
    doCollect() {
        return deviceInfo.osFullName;
    }
}
export default new OsFullName();
