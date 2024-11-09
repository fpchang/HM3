import { CollectBase } from '../CollectBase';
import fs from '@ohos.file.fs';
class CpuFrequency extends CollectBase {
    constructor() {
        super();
        this.name = 'HD13';
    }
    doCollect() {
        let j4 = '/proc/cpuinfo';
        let k4 = {
            encoding: 'utf-8'
        };
        let l4 = fs.readLinesSync(j4, k4);
        const m4 = new RegExp('\\s+');
        try {
            for (let o4 = l4.next();; o4 = l4.next()) {
                let p4 = o4.value;
                if (p4.includes('BogoMIPS')) {
                    let q4 = p4.split(m4);
                    if (q4.length >= 3) {
                        return q4[2];
                    }
                }
            }
        }
        catch (n4) {
            console.log('read cpuinfo exception: ' + n4);
        }
        return null;
    }
}
export default new CpuFrequency();
