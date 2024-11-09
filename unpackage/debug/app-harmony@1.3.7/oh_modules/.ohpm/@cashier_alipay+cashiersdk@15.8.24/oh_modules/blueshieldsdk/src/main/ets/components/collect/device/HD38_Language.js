import { CollectBase } from '../CollectBase';
import I18n from '@ohos.i18n';
class Language extends CollectBase {
    constructor() {
        super();
        this.name = 'HD38';
    }
    doCollect() {
        return I18n.System.getSystemLanguage();
    }
}
export default new Language();
