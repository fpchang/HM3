import { JSONObject } from './JSONObject';
export declare class JSONArray {
    private array;
    constructor(v41?: string | any[]);
    get(u41: number): any;
    length(): number;
    applyToArray(t41: (item: any, index: number, array: any[]) => void): void;
    put(q41: any): void;
    put(r41: number, s41: any): void;
    remove(p41: number): void;
    getString(n41: number, o41?: string): string;
    getBoolean(l41: number, m41?: boolean): boolean;
    getNumber(j41: number, k41?: number): number;
    getJsonObject(h41: number, i41?: JSONObject | null): JSONObject | null;
    getJsonArray(f41: number, g41?: JSONArray | null): JSONArray | null;
    getArray<c41>(d41: number, e41?: c41[] | null): c41[] | null;
    toJson(): string;
}
