import { JsonUtils } from '../utils/JsonUtils';
import { JSONArray } from './JSONArray';
export class JSONObject {
    constructor(b34 = {}) {
        try {
            if (typeof b34 === "string") {
                this.object = JSON.parse(b34);
            }
            else {
                this.object = b34;
            }
        }
        catch (c34) {
            this.object = {};
        }
    }
    getString(y33, z33 = "") {
        const a34 = this.object[y33];
        return typeof a34 === 'string' ? a34 : z33;
    }
    getBoolean(v33, w33 = false) {
        const x33 = this.object[v33];
        return typeof x33 === 'boolean' ? x33 : w33;
    }
    getNumber(s33, t33 = 0) {
        const u33 = this.object[s33];
        return typeof u33 === 'number' ? u33 : t33;
    }
    getJsonObject(p33, q33 = null) {
        const r33 = this.object[p33];
        if (typeof r33 === 'object' && r33 !== null && !Array.isArray(r33)) {
            return new JSONObject(r33);
        }
        else if (q33 === null) {
            return null;
        }
        else {
            return new JSONObject(q33);
        }
    }
    getJsonArray(m33, n33 = null) {
        const o33 = this.object[m33];
        if (Array.isArray(o33)) {
            return new JSONArray(o33);
        }
        return n33 === null ? null : n33;
    }
    getArray(i33, j33 = null) {
        try {
            const l33 = this.object[i33];
            if (Array.isArray(l33)) {
                return l33;
            }
        }
        catch (k33) {
        }
        return j33 === null ? null : j33;
    }
    hasKey(h33) {
        return Object.hasOwnProperty.call(this.object, h33);
    }
    put(f33, g33) {
        this.object[f33] = g33;
    }
    remove(e33) {
        delete this.object[e33];
    }
    applyToArray(b33, c33) {
        let d33 = this.getJsonArray(b33);
        d33.applyToArray(c33);
    }
    toJson() {
        const y32 = {};
        for (const [z32, a33] of Object.entries(this.object)) {
            if (a33 instanceof JSONObject) {
                y32[z32] = JSON.parse(a33.toJson());
            }
            else if (a33 instanceof JSONArray) {
                y32[z32] = JSON.parse(a33.toJson());
            }
            else {
                y32[z32] = a33;
            }
        }
        return JSON.stringify(y32);
    }
    toInstance(x32) {
        return JsonUtils.parseJsonToInstance(this.object, x32);
    }
}
