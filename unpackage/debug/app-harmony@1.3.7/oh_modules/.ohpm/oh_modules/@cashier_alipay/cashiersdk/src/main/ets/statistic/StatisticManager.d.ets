import { BizContext } from '../context/BizContext';
export declare class StatisticManager {
    private constructor();
    static stash(u39: BizContext | undefined, v39: string, w39: string): void;
    static submit(r39: BizContext | undefined, s39: string, t39: string): void;
    static forceUploadExisting(q39: BizContext | undefined): void;
    static putError(m39: BizContext | undefined, n39: string, o39: string, p39: Error | undefined): void;
    static putErrorWithRes(h39: BizContext | undefined, i39: string, j39: string, k39: Error | undefined, l39: string): void;
    static putAction(d39: BizContext | undefined, e39: string, f39: string, g39?: string | undefined): void;
    static localSequence(): number;
    static requestSequence(): number;
}
