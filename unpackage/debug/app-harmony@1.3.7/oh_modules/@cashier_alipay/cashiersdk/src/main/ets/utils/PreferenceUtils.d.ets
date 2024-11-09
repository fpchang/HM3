import dataPreferences from '@ohos.data.preferences';
export declare class PreferenceUtils {
    static readonly SHARE_PREFERENCE_NAME = "alipay_sdk_preference";
    private static instance;
    private preferences?;
    private constructor();
    static getInstance(): PreferenceUtils;
    get(a41: string, b41: dataPreferences.ValueType): dataPreferences.ValueType;
    put(y40: string, z40: dataPreferences.ValueType): void;
}
