export declare class Crypt {
    static encryptRSA2048(a45: string, b45: string): Promise<Uint8Array>;
    /**
     * @param key
     * @param content
     * @param iSrc
     * @returns
     */
    static encrypt3DES192(y44: string, z44: Uint8Array): Promise<Uint8Array>;
    static decrypt3DES192(w44: string, x44: Uint8Array): Promise<Uint8Array>;
    private static genIVParamsSpec;
}
