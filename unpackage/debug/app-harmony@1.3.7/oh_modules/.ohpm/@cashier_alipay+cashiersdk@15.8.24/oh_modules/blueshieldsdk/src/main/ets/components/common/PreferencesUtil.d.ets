import dataPreferences from '@ohos.data.preferences';
export declare class PreferencesUtil {
    private static readonly secPrefsTag;
    private static prefs;
    private static getPreferences;
    static read(o17: string, p17?: dataPreferences.ValueType): Promise<dataPreferences.ValueType | undefined | null>;
    static save(l17: string, m17: dataPreferences.ValueType | undefined | null, n17?: boolean): Promise<number>;
    private static flush;
}
