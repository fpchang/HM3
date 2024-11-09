import { CollectBase } from '../CollectBase';
import deviceInfo from '@ohos.deviceInfo';
class ProductModel extends CollectBase {
    constructor() {
        super();
        this.name = 'HE10';
    }
    doCollect() {
        return deviceInfo.productModel;
    }
}
export default new ProductModel();
