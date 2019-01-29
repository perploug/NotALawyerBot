import { ILicenseTypes } from "../interfaces/ilicensetypes";
declare function FindCompatible(baselicense: string): Array<string>;
declare let LicenseTypes: ILicenseTypes;
export { LicenseTypes, FindCompatible };
