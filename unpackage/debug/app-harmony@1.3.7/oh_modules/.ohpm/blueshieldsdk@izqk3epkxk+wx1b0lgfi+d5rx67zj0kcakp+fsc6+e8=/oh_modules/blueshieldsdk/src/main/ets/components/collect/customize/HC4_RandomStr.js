import { CollectBase } from '../CollectBase';
import { PreferencesUtil } from '../../common/PreferencesUtil';
import util from '@ohos.util';
import asset from "@ohos.security.asset";
class RandomStr extends CollectBase {
    constructor() {
        super();
        this.randomStr = null;
        this.prefsKey = 'bs_hc4';
        this.name = 'HC4';
    }
    static stringToArray(y3) {
        let z3 = new util.TextEncoder();
        return z3.encodeInto(y3);
    }
    static arrayToString(v3) {
        let w3 = util.TextDecoder.create("utf-8", { ignoreBOM: true });
        let x3 = w3.decodeWithStream(v3, { stream: false });
        return x3;
    }
    async doCollect() {
        if (this.randomStr !== null) {
            return this.randomStr;
        }
        try {
            let i3 = await PreferencesUtil.read(this.prefsKey);
            if (typeof i3 === 'string') {
                this.randomStr = i3;
                return this.randomStr;
            }
            let j3 = new Map();
            j3.set(asset.Tag.ALIAS, RandomStr.stringToArray(this.prefsKey));
            j3.set(asset.Tag.RETURN_TYPE, asset.ReturnType.ALL);
            i3 = await asset.query(j3).then((s3) => {
                for (let t3 = 0; t3 < s3.length; t3++) {
                    let u3 = s3[t3].get(asset.Tag.SECRET);
                    return RandomStr.arrayToString(u3);
                }
                return null;
            }).catch((r3) => {
                return null;
            });
            if (typeof i3 === 'string') {
                this.randomStr = i3;
                return this.randomStr;
            }
            let k3 = util.generateRandomUUID();
            await PreferencesUtil.save(this.prefsKey, k3, true);
            let l3 = new Map();
            l3.set(asset.Tag.SECRET, RandomStr.stringToArray(k3));
            l3.set(asset.Tag.ALIAS, RandomStr.stringToArray(this.prefsKey));
            l3.set(asset.Tag.IS_PERSISTENT, true);
            l3.set(asset.Tag.ACCESSIBILITY, asset.Accessibility.DEVICE_POWERED_ON);
            await asset.add(l3).then(() => {
                console.info(`Asset added successfully.`);
                this.randomStr = k3;
            }).catch((q3) => {
                return null;
            });
        }
        catch (g3) {
            let h3 = g3;
            console.error(`collect hc4 error: Code is ${h3.code}, message is ${h3.message}`);
        }
        return this.randomStr;
    }
}
export default new RandomStr();
