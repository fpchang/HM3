export declare class ApdIdManager {
    private static instance;
    private constructor();
    static getInstance(): ApdIdManager;
    private apdIdModule;
    private apdIdToken;
    init(i44: Context): Promise<string>;
    private initToken;
    getToken(): string;
}
