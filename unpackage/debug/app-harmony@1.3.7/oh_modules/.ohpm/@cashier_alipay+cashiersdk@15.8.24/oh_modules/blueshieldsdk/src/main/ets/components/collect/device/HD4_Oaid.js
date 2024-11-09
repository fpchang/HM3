import { CollectBase } from '../CollectBase';
import identifier from '@ohos.identifier.oaid';
class Oaid extends CollectBase {
    constructor() {
        super();
        this.name = 'HD4';
    }
    doCollect() {
        return identifier.getOAID().then((j5) => {
            return j5;
        });
    }
}
export default new Oaid();
