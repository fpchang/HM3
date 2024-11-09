import { CollectBase } from '../CollectBase';
class UserId extends CollectBase {
    constructor() {
        super();
        this.name = 'HC5';
    }
    doCollect(a4) {
        return (a4 && a4.userId) ? a4.userId : null;
    }
}
export default new UserId();
