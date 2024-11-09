import { BizContext } from '../context/BizContext';
import { JSONObject } from '../utils/Utils';
import { ActionType } from './ActionType';
export declare class ElementAction {
    actionType: ActionType;
    name: string;
    params: string[];
    constructor(l38: string, m38: ActionType);
    static update(j38: BizContext, k38: ElementAction): void;
    static parse(i38: JSONObject | null): ElementAction[];
    private static parseActionName;
    private static parseParams;
}
