import { Letter } from './Letter';
import cryptoFramework from '@ohos.security.cryptoFramework';
export declare class PackInfo {
    private isGzip;
    private bytes;
    constructor(o44: boolean, p44: Uint8Array);
    getIsGzip(): boolean;
    getBytes(): Uint8Array;
}
export declare class LetterPacker {
    /**
     * 是否加密(上下行保持一致)
     */
    isEncrypt: boolean;
    /**
     * 加密 key
     */
    key: string;
    constructor(n44: boolean);
    packet(l44: Letter, m44: boolean): Promise<PackInfo | null>;
    /**
     * 将一系列 dataField 封装为 05d%length - dataField 的形式
     */
    packetMulti(...k44: Uint8Array[]): Uint8Array;
    static genIVParamsSpec(): cryptoFramework.IvParamsSpec;
    unPacket(j44: PackInfo): Promise<Letter | null>;
}
