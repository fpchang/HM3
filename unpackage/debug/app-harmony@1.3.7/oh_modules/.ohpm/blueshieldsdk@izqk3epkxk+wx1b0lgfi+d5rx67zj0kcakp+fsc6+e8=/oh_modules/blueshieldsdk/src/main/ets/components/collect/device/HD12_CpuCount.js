import { CollectBase } from '../CollectBase';
import fs from '@ohos.file.fs';
class CpuCount extends CollectBase {
    constructor() {
        super();
        this.name = 'HD12';
    }
    doCollect() {
        let c4 = '/proc/cpuinfo';
        let d4 = {
            encoding: 'utf-8'
        };
        let e4 = 0;
        let f4 = fs.readLinesSync(c4, d4);
        try {
            for (let h4 = f4.next();; h4 = f4.next()) {
                let i4 = h4.value;
                if (i4.includes('processor')) {
                    ++e4;
                }
            }
        }
        catch (g4) {
            console.log('read cpuinfo exception: ' + g4);
        }
        return e4;
    }
}
export default new CpuCount();
