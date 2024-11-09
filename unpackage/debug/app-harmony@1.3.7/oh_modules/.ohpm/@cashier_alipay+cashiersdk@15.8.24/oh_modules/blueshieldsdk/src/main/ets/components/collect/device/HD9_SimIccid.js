import { CollectBase } from '../CollectBase';
import sim from '@ohos.telephony.sim';
class SimIccid extends CollectBase {
    constructor() {
        super();
        this.name = 'HD9';
    }
    doCollect() {
        return sim.getActiveSimAccountInfoList().then((p5) => {
            console.log(`getActiveSimAccountInfoList success, promise: data->${JSON.stringify(p5)}`);
            let q5 = {};
            for (const r5 of p5) {
                q5[r5.slotIndex] = r5.iccId;
            }
            return JSON.stringify(q5);
        });
    }
}
export default new SimIccid();
