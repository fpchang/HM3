import { CollectBase } from '../CollectBase';
import systemDateTime from '@ohos.systemDateTime';
class Timezone extends CollectBase {
    constructor() {
        super();
        this.name = 'HD37';
    }
    doCollect() {
        return systemDateTime.getTimezoneSync();
    }
}
export default new Timezone();
