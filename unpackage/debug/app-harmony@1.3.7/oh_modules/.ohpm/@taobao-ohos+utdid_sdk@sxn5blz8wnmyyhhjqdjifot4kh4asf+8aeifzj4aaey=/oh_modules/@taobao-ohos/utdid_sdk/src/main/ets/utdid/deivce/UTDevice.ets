import UTUtdid from './UTUTdid';
import { StringUtils } from '../../utils/StringUtils';
import { Context } from '@kit.AbilityKit';

const DEFAULT_UTDID = 'ffffffffffffffffffffffff';

export class UTDevice {
  private static utdid: string = '';

  // 同步Get方法
  static getUtdid(context: Context | undefined | null): string {
    try {
      if (!context) {
        console.debug("[UTDID]error in getUtdid: context should not be null or undefined.");
        return DEFAULT_UTDID;
      } else {
        // 判断缓存中是否已经有值
        if (StringUtils.isEmpty(UTDevice.utdid)) {
          // 从Preferences中取值,没有就重新生成
          let res: string = UTUtdid.initUtdid(context);
          console.debug("[UTDID]getUtdidFromPreferences:" + res);
          if (!StringUtils.isEmpty(res)) {
            UTDevice.utdid = res;
          };
          // 判断返回值是否合法
          if (StringUtils.isEmpty (UTDevice.utdid)) {
            return DEFAULT_UTDID;
          } else {
            return UTDevice.utdid;
          }
        } else {
          console.debug("[UTDID]getUtdidFromCache:" + UTDevice.utdid);
          return UTDevice.utdid;
        }
      }
    } catch (e) {
      console.debug("[UTDID]error in getUtdid.");
      return DEFAULT_UTDID;
    }
  }
}