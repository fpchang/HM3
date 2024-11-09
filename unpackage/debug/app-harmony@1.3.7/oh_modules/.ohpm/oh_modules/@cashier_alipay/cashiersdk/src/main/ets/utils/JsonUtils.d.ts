export declare class JsonUtils {
    /**
     * 将 JSON 字符串 或者 Record 解析为指定类型的对象，并为其赋予类的方法
     * @param data
     * @param type
     * @returns
     */
    static parseJsonToInstance<b43>(c43: string | Record<string, any>, d43: {
        new (...args: any[]): b43;
    }): b43;
}
