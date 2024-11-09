import { CollectBase } from '../CollectBase';
import display from '@ohos.display';
class ScreenWidth extends CollectBase {
    constructor() {
        super();
        this.name = 'HD6';
    }
    doCollect() {
        let k5 = null;
        k5 = display.getDefaultDisplaySync();
        return k5.width;
    }
}
export default new ScreenWidth();
