import { CollectBase } from '../CollectBase';
import statvfs from '@ohos.file.statvfs';
class DataPathSize extends CollectBase {
    constructor() {
        super();
        this.name = 'HD15';
    }
    doCollect() {
        let z4 = "/data";
        return statvfs.getTotalSizeSync(z4);
    }
}
export default new DataPathSize();
