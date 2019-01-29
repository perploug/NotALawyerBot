import { StatusEnum } from "./StatusEnum";

export interface ILicenseConfig {
  onlyAllow?: string[],
  exclude?: string[],
  onNotFound: StatusEnum,
  onNolicense: StatusEnum,
}