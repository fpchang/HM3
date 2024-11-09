import { JSONArray } from './JSONArray';
export declare class JSONObject {
    private object;
    constructor(a43?: string | Record<string, any>);
    getString(y42: string, z42?: string): string;
    getBoolean(w42: string, x42?: boolean): boolean;
    getNumber(u42: string, v42?: number): number;
    getJsonObject(s42: string, t42?: Record<string, any> | null): JSONObject | null;
    getJsonArray(q42: string, r42?: JSONArray | null): JSONArray | null;
    getArray<n42>(o42: string, p42?: n42[] | null): n42[] | null;
    hasKey(m42: string): boolean;
    put(k42: string, l42: any): void;
    remove(j42: string): void;
    applyToArray(h42: string, i42: (item: any, index: number, array: any[]) => void): void;
    toJson(): string;
    toInstance<f42>(g42: {
        new (...args: any[]): f42;
    }): f42;
}
