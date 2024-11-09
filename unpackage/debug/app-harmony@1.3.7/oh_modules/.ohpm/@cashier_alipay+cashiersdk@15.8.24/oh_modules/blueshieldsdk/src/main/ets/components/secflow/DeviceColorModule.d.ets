import { IDeviceColorModule } from './IDeviceColorModule';
export declare class DeviceColorModule implements IDeviceColorModule {
    getColorLabel(g21: string, h21: Map<string, string>): string;
    initColorInfo(): number;
    getColorInfo(d21: string, e21: string, f21: Map<string, string>): string;
}
