import { CollectBase } from '../CollectBase';
import display from '@ohos.display';
class ScreenHeight extends CollectBase {
    constructor() {
        super();
        this.name = 'HD7';
    }
    doCollect() {
        let l5 = null;
        l5 = display.getDefaultDisplaySync();
        return l5.height;
    }
}
export default new ScreenHeight();
