import { CollectBase } from '../CollectBase';
import bundleManager from '@ohos.bundle.bundleManager';
class AppVersion extends CollectBase {
    constructor() {
        super();
        this.name = 'HA2';
    }
    doCollect() {
        let e2 = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
        return bundleManager.getBundleInfoForSelf(e2).then((g2) => {
            return g2.versionName;
        });
    }
}
export default new AppVersion();
