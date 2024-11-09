import dataPreferences from '@ohos.data.preferences';
export class PreferenceUtils {
    constructor() { }
    static getInstance() {
        if (!PreferenceUtils.instance) {
            PreferenceUtils.instance = new PreferenceUtils();
            if (getContext()) {
                PreferenceUtils.instance.preferences = dataPreferences.getPreferencesSync(getContext(), { name: PreferenceUtils.SHARE_PREFERENCE_NAME });
            }
        }
        return PreferenceUtils.instance;
    }
    get(b35, c35) {
        if (this.preferences?.hasSync(b35)) {
            return this.preferences.getSync(b35, c35);
        }
        return c35;
    }
    put(z34, a35) {
        this.preferences?.putSync(z34, a35);
        this.preferences?.flush();
    }
}
PreferenceUtils.SHARE_PREFERENCE_NAME = 'alipay_sdk_preference';
