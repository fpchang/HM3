import dataPreferences from '@ohos.data.preferences';
import GlobalContext from './GlobalContext';
export class PreferencesUtil {
    static getPreferences() {
        if (PreferencesUtil.prefs === null) {
            let h8 = { name: PreferencesUtil.secPrefsTag, };
            PreferencesUtil.prefs = dataPreferences.getPreferencesSync(GlobalContext.getContext(), h8);
        }
        return PreferencesUtil.prefs;
    }
    static async read(c8, d8) {
        try {
            let f8 = PreferencesUtil.getPreferences();
            if (!f8.hasSync(c8)) {
                return d8;
            }
            let g8 = f8.getSync(c8, d8);
            return g8;
        }
        catch (e8) {
            return null;
        }
    }
    static async save(l7, m7, n7 = true) {
        let o7 = PreferencesUtil.getPreferences();
        let p7 = 0;
        return new Promise(async (r7) => {
            if (m7 == null || m7 == undefined) {
                await o7.delete(l7).then(async () => {
                    if (n7) {
                        await PreferencesUtil.flush().catch((b8) => {
                            r7(b8.code);
                        });
                    }
                    r7(p7);
                }).catch((z7) => {
                    r7(z7.code);
                });
            }
            else {
                await o7.put(l7, m7).then(async () => {
                    if (n7) {
                        await PreferencesUtil.flush().catch((w7) => {
                            r7(w7.code);
                        });
                    }
                    r7(p7);
                }).catch((u7) => {
                    r7(u7.code);
                });
            }
        });
    }
    static async flush() {
        let k7 = PreferencesUtil.getPreferences();
        return await k7.flush();
    }
}
PreferencesUtil.secPrefsTag = "APSecurity";
PreferencesUtil.prefs = null;
