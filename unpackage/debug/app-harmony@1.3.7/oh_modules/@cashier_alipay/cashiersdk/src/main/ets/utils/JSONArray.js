import { JSONObject } from './JSONObject';
export class JSONArray {
    constructor(v32 = []) {
        try {
            if (typeof v32 === "string") {
                this.array = JSON.parse(v32);
            }
            else {
                this.array = v32;
            }
        }
        catch (w32) {
            this.array = [];
        }
    }
    get(u32) {
        if (u32 < 0 || u32 >= this.array.length) {
            return null;
        }
        return this.array[u32];
    }
    length() {
        return this.array.length;
    }
    applyToArray(q32) {
        this.array.forEach((s32, t32) => {
            if (Array.isArray(s32)) {
                q32(new JSONArray(s32), t32, this.array);
            }
            else if (typeof s32 === 'object' && s32 !== null) {
                q32(new JSONObject(s32), t32, this.array);
            }
            else {
                q32(s32, t32, this.array);
            }
        });
    }
    put(o32, p32) {
        if (typeof o32 === "number" && p32 !== undefined) {
            while (o32 >= this.array.length) {
                this.array.push(null);
            }
            this.array[o32] = p32;
        }
        else {
            this.array.push(o32);
        }
    }
    remove(n32) {
        if (n32 >= 0 && n32 < this.array.length) {
            this.array.splice(n32, 1);
        }
    }
    getString(k32, l32 = "") {
        const m32 = this.get(k32);
        return typeof m32 === 'string' ? m32 : l32;
    }
    getBoolean(h32, i32 = false) {
        const j32 = this.get(h32);
        return typeof j32 === 'boolean' ? j32 : i32;
    }
    getNumber(e32, f32 = 0) {
        const g32 = this.get(e32);
        return typeof g32 === 'number' ? g32 : f32;
    }
    getJsonObject(b32, c32 = null) {
        const d32 = this.get(b32);
        if (typeof d32 === 'object' && d32 !== null && !Array.isArray(d32)) {
            return new JSONObject(d32);
        }
        return c32 === null ? null : c32;
    }
    getJsonArray(y31, z31 = null) {
        const a32 = this.get(y31);
        if (Array.isArray(a32)) {
            return new JSONArray(a32);
        }
        return z31 === null ? null : z31;
    }
    getArray(u31, v31 = null) {
        try {
            const x31 = this.get(u31);
            if (Array.isArray(x31)) {
                return x31;
            }
        }
        catch (w31) {
        }
        return v31 === null ? null : v31;
    }
    toJson() {
        return JSON.stringify(this.array.map(t31 => {
            if (t31 instanceof JSONObject) {
                return JSON.parse(t31.toJson());
            }
            else if (t31 instanceof JSONArray) {
                return JSON.parse(t31.toJson());
            }
            else {
                return t31;
            }
        }));
    }
}
