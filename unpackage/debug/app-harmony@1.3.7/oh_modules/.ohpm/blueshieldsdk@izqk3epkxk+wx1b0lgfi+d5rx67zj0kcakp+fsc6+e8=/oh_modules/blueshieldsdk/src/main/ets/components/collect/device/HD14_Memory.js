import { CollectBase } from '../CollectBase';
import fs from '@ohos.file.fs';
class Memory extends CollectBase {
    constructor() {
        super();
        this.name = 'HD14';
    }
    doCollect() {
        let r4 = '/proc/meminfo';
        let s4 = {
            encoding: 'utf-8'
        };
        let t4 = fs.readLinesSync(r4, s4);
        const u4 = new RegExp('\\s+');
        try {
            for (let w4 = t4.next();; w4 = t4.next()) {
                let x4 = w4.value;
                if (x4.includes('MemTotal')) {
                    let y4 = x4.split(u4);
                    if (y4.length >= 3) {
                        return y4[1];
                    }
                }
            }
        }
        catch (v4) {
            console.log('read cpuinfo exception: ' + v4);
        }
        return null;
    }
}
export default new Memory();
