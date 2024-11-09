import { StatisticRecord } from '../statistic/StatisticRecord';
export declare class BizContext {
    static NEW_EXTERNAL_INFO_WITH_DOUBLE_EQUAL: string;
    context: Context | undefined;
    uniquePayload: string;
    invokeTag: string | undefined;
    record: StatisticRecord | undefined;
    apLinkToken: string | undefined;
    private constructor();
    static createInstance(f38: Context, g38?: string, h38?: string | undefined): Promise<BizContext>;
    init(c38: Context, d38?: string, e38?: string | undefined): Promise<void>;
    private generateExtPayTradeToken;
    format(b38: string): string;
    getSafeContext(): Context;
    private formatEncoded;
    private formatNoEncoded;
    private formatBizContextForKeyValueOrderStr;
    /**
     * 构造一个新的bizcontext。
     *
     * @param header
     *            bizcontext的头，如:"bizcontext="或"bizcontext=\""
     * @param tail
     *            bizcontext的尾，如：""或"\""
     * @return
     */
    private buildBizContext;
    /**
     * 找到bizcontext键值对。如果订单信息orderInfo使用pairConnection拆分之后，其前缀为pairPrefix则认为匹配到。
     *
     * @param orderInfo
     *            订单信息
     * @param pairConnection
     *            拆分字符串
     * @param pairPrefix
     *            键值对前缀
     * @return
     */
    private findBizContext;
    private isTradeEncoded;
    private formatJsonEncode;
    private formatBizContextForJsonOrderStr;
    private buildSimpleBizContext;
}
