import HD3 from './HD3_SensorListDigest';
import HD4 from './HD4_Oaid';
import HD5 from './HD5_Aaid';
import HD6 from './HD6_ScreenWidth';
import HD7 from './HD7_ScreenHeight';
import HD8 from './HD8_MacAddress';
import HD9 from './HD9_SimIccid';
import HD10 from './HD10_Udid';
import HD12 from './HD12_CpuCount';
import HD13 from './HD13_CpuFrequency';
import HD14 from './HD14_Memory';
import HD15 from './HD15_DataPathSize';
import HD19 from './HD19_NetworkType';
import HD37 from './HD37_Timezone';
import HD38 from './HD38_Language';
import HL3 from './HL3_WifiMac';
export const HD_STATIC = [
    HD4,
    HD5,
    HD6,
    HD7,
    HD8,
    HD9,
    HD10,
    HD12,
    HD13,
    HD14,
    HD15,
    HD37,
    HL3
];
export const HD_DYNAMIC = [
    HD3,
    HD19,
    HD38,
    HL3
];
