import { store } from "../store/store";

export const isSuperAdmin = () => {
  console.log(store.getState().userInfo.userInfo?.isSuperAdmin);

  return store.getState().userInfo.userInfo?.isSuperAdmin === 1 ? true : false;
};
