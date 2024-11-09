export class StringUtils {
  static isEmpty(str: string): boolean {
    return str == null || str == undefined || typeof str !== 'string' || str.trim().length == 0;
  }
}