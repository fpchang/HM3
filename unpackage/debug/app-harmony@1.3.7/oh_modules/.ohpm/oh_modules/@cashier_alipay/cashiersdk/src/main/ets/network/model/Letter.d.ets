import { JSONObject } from '../../utils/Utils';
export declare class Letter {
    private envelop;
    private body;
    constructor(d42: string, e42: string);
    getEnvelop(): string;
    getBody(): string;
    getTemplate(): JSONObject;
}
