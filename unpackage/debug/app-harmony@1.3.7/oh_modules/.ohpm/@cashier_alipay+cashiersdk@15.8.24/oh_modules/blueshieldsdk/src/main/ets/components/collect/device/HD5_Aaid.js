import { CollectBase } from '../CollectBase';
import AAID from '@hms.core.AAID';
class Aaid extends CollectBase {
    constructor() {
        super();
        this.name = 'HD5';
    }
    doCollect() {
        return AAID.getAAID();
    }
}
export default new Aaid();
