import { BizContext } from '../context/BizContext';
import { JSONObject } from '../utils/Utils';
import { NetworkTask } from './NetworkTask';
import { HashMap } from '@kit.ArkTS';
export declare class DynamicConfigPacket extends NetworkTask {
    getApiVersion(): string;
    buildAction(): JSONObject;
    isWifiMocked(): boolean;
    getName(): string;
    buildEnvelopInner(m45: BizContext, n45: Map<string, string>, o45: HashMap<string, string>): string;
    private generateRequestParams;
}
