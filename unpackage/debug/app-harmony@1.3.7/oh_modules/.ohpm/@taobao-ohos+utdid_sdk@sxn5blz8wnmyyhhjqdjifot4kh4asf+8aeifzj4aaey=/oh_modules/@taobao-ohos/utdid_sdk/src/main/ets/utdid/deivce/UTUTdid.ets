import buffer from '@ohos.buffer';
import util from '@ohos.util';
import dataPreferences from '@ohos.data.preferences';
import { BusinessError } from '@ohos.base';
import CryptoForUtdid from './CryptoForUtdid'
import { StringUtils } from '../../utils/StringUtils';

const PREFERENCES_NAME = 'Alvin2';
const KEY_UTDID = 'UTDID2';
const DEFAULT_UTDID_EMPTY = '';
const DEFAULT_UTDID_LENGTH = 24;

export default class UTUtdid {
  private static utdid: string = DEFAULT_UTDID_EMPTY;

  static initUtdid(context: Context): string {
    if (!StringUtils.isEmpty(UTUtdid.utdid) && UTUtdid.utdid.length == DEFAULT_UTDID_LENGTH) {
      return UTUtdid.utdid;
    }

    if (context == null) {
      return DEFAULT_UTDID_EMPTY;
    }

    UTUtdid.init(context);
    return UTUtdid.utdid;
  }

  private static init =(() => {
    let isInit = false;
    return (context: Context) => {
      if (!isInit) {
        isInit = true;
        UTUtdid.initUtdidFromPreferences(context);
      }
    }
  })()

  private static initUtdidFromPreferences(context: Context): void | undefined {
    let preferences: dataPreferences.Preferences | null = null;
    try {
      let options: dataPreferences.Options =  { name: PREFERENCES_NAME };
      preferences  = dataPreferences.getPreferencesSync(context, options);
    } catch (err) {
      console.error("[UTDID]Failed to get preferences. code =" + err.code + ", message =" + err.message);
      return;
    }

    let utdid: dataPreferences.ValueType = '';
    try {
      utdid = preferences!!.getSync(KEY_UTDID, '');
    } catch (err) {
      console.error("[UTDID]Failed to get value of 'startup'. code =" + err.code + ", message =" + err.message);
      return;
    }

    if (!StringUtils.isEmpty(utdid as string) && (utdid as string).length == DEFAULT_UTDID_LENGTH) {
      UTUtdid.utdid = utdid as string;
      return;
    }

    // 重新生成utdid
    try {
      utdid = UTUtdid.generateUtdid();
    } catch (err) {
      console.error("[UTDID]Failed to generateUtdid. code =" + err.code + ", message =" + err.message);
      return;
    }

    try {
      preferences!!.putSync(KEY_UTDID, utdid);
      // 将当前Preferences实例的数据异步存储到用户首选项的持久化文件中
      preferences?.flush();
    } catch (err) {
      console.error("[UTDID]Failed to put value of 'startup'. code =" + err.code + ", message =" + err.message);
      return;
    }

    UTUtdid.utdid = utdid as string;
  }

  private static generateUtdid(): string {
    let buf = buffer.allocUninitializedFromPool(14);

    const timestamp = new Date().getTime(); // 单位s
    const timestampSeconds = Math.floor(timestamp / 1000); // 单位ms
    const bufferTime = new ArrayBuffer(4); // Create a buffer of 4 bytes
    const view = new DataView(bufferTime); // Create a DataView to access the buffer
    view.setUint32(0, timestampSeconds); // Set the number as a 32-bit unsigned integer in the buffer
    buf.writeUInt32BE(timestampSeconds, 0);

    const min = 0;
    //The resulting maxUint32 variable will contain the maximum value of an unsigned 32-bit integer, which is 4294967295.
    const max = Math.pow(2, 32) - 1;
    // Generate a random number within the specified range
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    //hilog.info(0x0000, 'testUtdidTag', 'randomNum %{public}d', randomNum);
    buf.writeUInt32BE(randomNum, 4);

    const version = 3;
    const reserve = 0;
    buf.writeUInt8(version, 8);
    buf.writeUInt8(reserve, 9);

    let uuid: string = util.generateRandomUUID(false);
    const hashCode = UTUtdid.getStringHashCode(uuid);
    //hilog.info(0x0000, 'testUtdidTag', 'uuid hashCode %{public}d', hashCode);
    buf.writeUInt32BE(hashCode, 10);

    //ricky test
    let pubKeyArray = new Uint8Array([100, 54, 102, 99, 51, 97, 52, 97, 48, 54, 97, 100, 98, 100, 101, 56, 57, 50, 50, 51, 98, 118, 101, 102, 101, 100, 99, 50, 52, 102, 101, 99, 100, 101, 49, 56, 56, 97, 97, 97, 57, 49, 54, 49]);
    let inputData = new Uint8Array(buf.length);
    buf.copy(inputData, 0, 0, buf.length);
    let pubKeyArrayString = UTUtdid.Uint8ArrayToString(pubKeyArray);
    let inputDataString = UTUtdid.Uint8ArrayToString(inputData);

    let hmacSha1 = '';
    try {
      hmacSha1 = CryptoForUtdid.sha1_hmac(inputDataString, pubKeyArrayString);
    } catch (error) {
      console.error("[UTDID]Failed to CryptoForUtdid. error code: " + error.code + ", message is: " + error.message);
      return DEFAULT_UTDID_EMPTY;
    }

    let hmacArray = UTUtdid.hexStringToUint8Array(hmacSha1)
    let hmacBase64 = new util.Base64Helper().encodeToStringSync(hmacArray);
    const hmacHashCode = UTUtdid.getStringHashCode(hmacBase64);

    let bufferAll = buffer.allocUninitializedFromPool(18);
    buf.copy(bufferAll, 0, 0, buf.length);
    bufferAll.writeUInt32BE(hmacHashCode, 14);

    let bufferAllArray = new Uint8Array(bufferAll.length);
    bufferAll.copy(bufferAllArray, 0, 0, bufferAllArray.length);
    let resultBytes = new util.Base64Helper().encodeSync(bufferAllArray);
    let resultString: string = UTUtdid.utf8ArrayToString(resultBytes);

    return resultString;
  }

  // turn uint8Arr to string
  private static Uint8ArrayToString(fileData: Uint8Array) {
    let dataString: string = '';
    for (let i = 0;i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i])
    }
    return dataString
  }

  private static hexStringToUint8Array(hexString: string) {
    hexString = String(hexString);
    if (hexString.length % 2 !== 0) {
      throw new Error("Invalid hexString");
    }
    let arrayBuffer = new Uint8Array(hexString.length / 2);

    for (let i = 0; i < hexString.length; i += 2) {
      let byteValue = parseInt(hexString.substr(i, 2), 16);
      if (isNaN(byteValue)) {
        throw new Error("Invalid hexString");
      }
      arrayBuffer[i/2] = byteValue;
    }

    return arrayBuffer;
  }

  private static utf8ArrayToString(array: Uint8Array) {
    if (!array)
      return '';
    let result = '';
    for (let i = 0, j = array.length; i < j; i++) {
      let code = array[i];
      if (code >= 0 && code <= 0x7f) {
        code = (0x7f & code);
      } else if (code <= 0xdf) {
        code = ((0x1F & array[i]) << 6) | (0x3f & array[i + 1]);
        i += 1;
      } else if (code <= 0xef) {
        code = ((0x0f & array[i]) << 12) | ((0x3f & array[i + 1]) << 6) | (0x3f & array[i + 2]);
        i += 2;
      } else {
        return '';
      }
      let char = String.fromCharCode(code);
      result += char;
    }
    return result;
  }

  private static getStringHashCode(str: string) {
    let hash = 0;

    if (str == null || str.length == 0) {
      return hash;
    }

    for (let i = 0; i < str.length; i++) {
      hash = ((hash * 31) + str.charCodeAt(i)) >>> 0;
    }

    return hash >>> 0; // Convert to a positive 32-bit integer
  }
}