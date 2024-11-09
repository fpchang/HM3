import { CollectArgs } from './CollectArgs';
/**
 * 因子采集基类
 */
export declare abstract class CollectBase {
    name: string;
    timeout: number;
    constructor();
    promiseWithTimeout<u21>(v21: Promise<u21>, w21: number): Promise<u21>;
    getCollectName(): string;
    getResult(t21: CollectArgs): Promise<Record<string, string>>;
    abstract doCollect(s21?: CollectArgs): Promise<string | number | null> | string | null | number;
}
