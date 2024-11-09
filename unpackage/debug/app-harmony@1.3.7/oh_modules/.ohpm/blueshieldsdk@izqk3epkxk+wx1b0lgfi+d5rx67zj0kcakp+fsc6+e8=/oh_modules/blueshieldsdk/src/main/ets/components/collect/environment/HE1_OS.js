import { CollectBase } from '../CollectBase';
class OS extends CollectBase {
    constructor() {
        super();
        this.name = 'HE1';
    }
    doCollect() {
        return 'harmony';
    }
}
export default new OS();
