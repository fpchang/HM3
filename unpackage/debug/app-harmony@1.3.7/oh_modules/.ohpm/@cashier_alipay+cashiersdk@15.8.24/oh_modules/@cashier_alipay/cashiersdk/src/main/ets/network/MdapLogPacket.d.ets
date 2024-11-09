import { BizContext } from '../context/BizContext';
import { JSONObject } from '../utils/Utils';
import { Letter } from './model/Letter';
import { NetworkTask } from './NetworkTask';
export declare class MdapLogPacket extends NetworkTask {
    buildHeaders(b42: boolean, c42: string): Map<string, string>;
    buildAction(): JSONObject;
    isWifiMocked(): boolean;
    buildBody(y41: BizContext, z41: string, a42: JSONObject): string;
    getName(): string;
    request(w41: BizContext, x41: string): Promise<Letter | null>;
}
