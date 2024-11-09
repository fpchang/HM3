import { CollectBase } from '../CollectBase';
import bundleManager from '@ohos.bundle.bundleManager';
class AppName extends CollectBase {
    constructor() {
        super();
        this.name = 'HA1';
    }
    doCollect() {
        let b2 = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
        return bundleManager.getBundleInfoForSelf(b2).then((d2) => {
            return d2.name;
        });
    }
}
export default new AppName();
