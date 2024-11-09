import { CollectBase } from '../CollectBase';
import sensor from '@ohos.sensor';
class SensorListDigest extends CollectBase {
    constructor() {
        super();
        this.name = 'HD3';
    }
    doCollect() {
        return sensor.getSensorList().then((f5) => {
            let g5 = '';
            for (let h5 = 0; h5 < f5.length; h5++) {
                g5 += f5[h5].sensorName;
                g5 += f5[h5].hardwareVersion;
                g5 += f5[h5].vendorName;
            }
            return g5;
        }, (e5) => {
            console.error(`Failed to get sensorList. Code: ${e5.code}, message: ${e5.message}`);
            return (`errCode:${e5.message}`);
        });
    }
}
export default new SensorListDigest();
