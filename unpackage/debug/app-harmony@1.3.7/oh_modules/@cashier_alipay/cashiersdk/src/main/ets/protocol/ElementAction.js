import { GlobalDefine } from '../const/GlobalDefine';
import { TidStorage } from '../tid/TidStorage';
import { isEmpty } from '../utils/Utils';
import { ActionType } from './ActionType';
export class ElementAction {
    constructor(e22, f22) {
        this.params = [];
        this.actionType = f22;
        this.name = e22;
    }
    static update(a22, b22) {
        let c22 = b22.params;
        if (c22.length == 1) {
            c22 = c22[0].replace(/'/g, '').split(",");
        }
        if (c22.length !== 3) {
            return;
        }
        if (GlobalDefine.TID === c22[0]) {
            const d22 = TidStorage.getInstance(a22);
            if (isEmpty(c22[1]) || isEmpty(c22[2])) {
                return;
            }
            d22.save(a22, c22[1], c22[2]);
        }
    }
    static parse(t21) {
        const u21 = [];
        if (t21 == null) {
            return u21;
        }
        const v21 = t21.name ?? "";
        const w21 = ElementAction.parseActionName(v21);
        for (let x21 = 0; x21 < w21.length; x21++) {
            const y21 = ActionType.getActionType(w21[x21]);
            if (y21 === ActionType.None) {
                continue;
            }
            const z21 = new ElementAction(w21[x21], y21);
            z21.params = ElementAction.parseParams(w21[x21]);
            u21.push(z21);
        }
        return u21;
    }
    static parseActionName(r21) {
        const s21 = [];
        if (isEmpty(r21)) {
            return s21;
        }
        return r21.split(";");
    }
    static parseParams(l21) {
        const m21 = [];
        if (isEmpty(l21)) {
            return m21;
        }
        const n21 = l21.indexOf('(');
        const o21 = l21.lastIndexOf(')');
        if (n21 === -1 || o21 === -1 || o21 <= n21) {
            return m21;
        }
        l21 = l21.substring(n21 + 1, o21);
        const p21 = l21.split("' *, *'", -1);
        for (const q21 of p21) {
            m21.push(q21.trim().replace(/'/g, "").replace("\"", ""));
        }
        return m21;
    }
}
