import { EdgeRiskResult, EdgeRiskUAMode, IEdgeRiskModule } from './IEdgeRiskModule';
export declare class EdgeRiskModule implements IEdgeRiskModule {
    initialize(): number;
    postUserAction(o21: EdgeRiskUAMode, p21: Map<string, string>): number;
    getRiskResult(l21: EdgeRiskUAMode, m21: Map<string, string>, n21: number): EdgeRiskResult;
}
