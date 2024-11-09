export declare class BASE64Helper {
    base64Alphabet: Uint8Array;
    lookUpBase64Alphabet: Uint8Array;
    BASELENGTH: number;
    LOOKUPLENGTH: number;
    constructor();
    decode(l45: string): ArrayBuffer | null;
    removeWhiteSpace(k45: Uint8Array): number;
    arrayCopy(f45: Uint8Array, g45: number, h45: Uint8Array, i45: number, j45: number): void;
    isData(e45: number): boolean;
    isPad(d45: number): boolean;
    isWhiteSpace(c45: number): boolean;
}
