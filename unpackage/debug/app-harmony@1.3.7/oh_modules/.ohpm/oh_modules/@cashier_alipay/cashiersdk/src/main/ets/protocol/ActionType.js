import { isEmpty } from '../utils/Utils';
export class ActionType {
    constructor(k21) {
        this.action = k21;
    }
    static getActionType(i21) {
        if (isEmpty(i21)) {
            return ActionType.None;
        }
        for (const j21 of ActionType.typeList) {
            if (i21.startsWith(j21.action)) {
                return j21;
            }
        }
        return ActionType.None;
    }
}
ActionType.None = new ActionType("none");
ActionType.WapPay = new ActionType("js://wappay");
ActionType.Update = new ActionType("js://update");
ActionType.OpenWeb = new ActionType("loc:openweb");
ActionType.SetResult = new ActionType("loc:setResult");
ActionType.Exit = new ActionType("loc:exit");
ActionType.typeList = [ActionType.None, ActionType.WapPay, ActionType.Update, ActionType.OpenWeb, ActionType.SetResult, ActionType.Exit];
