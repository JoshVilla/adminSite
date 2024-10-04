import { Types } from "mongoose";

interface IAccounts {
  facebook: string;
  twitter: string;
  tiktok: string;
}
export interface ISiteInfo {
  _id: Types.ObjectId | null;
  title: string;
  address: string;
  vision: string;
  mission: string;
  accounts: IAccounts;
  logo: "";
}
