import { AnyObject } from "antd/es/_util/type";

export interface IData {
  _id: Record<string, any> | string; // Replace AnyObject with Record<string, any>
  username: string;
  password: string;
  isSuperActive: boolean;
  __v: number;
  key: string;
}

export interface IParams {
  username: string;
  isSuperAdmin: Number | string;
  isActive: Number | string;
  createdAt: any[];
}

export interface IAddParams {
  username: string;
  password: string;
  isSuperAdmin: Number;
  createdAt: string;
}
