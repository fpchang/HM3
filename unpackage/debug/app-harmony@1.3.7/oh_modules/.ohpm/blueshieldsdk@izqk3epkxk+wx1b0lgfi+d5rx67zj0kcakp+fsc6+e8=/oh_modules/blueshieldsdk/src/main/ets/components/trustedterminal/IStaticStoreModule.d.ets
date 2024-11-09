export interface IStaticStoreModule {
    getCustomData(appKey: string, authName?: string): string;
}
