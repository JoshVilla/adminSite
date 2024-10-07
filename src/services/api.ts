import { deleteData, get, post } from "./service";

export const getAdmins = (params = {}) => {
  return post("http://localhost:5000/get", params);
};

export const loginApi = (params: {}) => {
  return post("http://localhost:5000/login", params);
};

export const addAdmin = (params: {}) => {
  return post("http://localhost:5000/addAdmin", params);
};

export const deleteAdmin = (params: {}) => {
  return deleteData("http://localhost:5000/delete", params);
};

export const saveAdmin = (params: {}) => {
  return post("http://localhost:5000/save", params);
};

export const siteInfo = (params: {}) => {
  return get("http://localhost:5000/siteInfo", params);
};

export const siteInfoUpdate = (params: {}) => {
  return post("http://localhost:5000/siteInfoUpdate", params);
};

export const homepageInfo = (params: {}) => {
  return get("http://localhost:5000/homepageInfo", params);
};

export const updateHomepageInfo = (params: {}) => {
  return post("http://localhost:5000/updateHomePageInfo", params);
};

export const deleteHomepageInfo = (params: {}) => {
  return post("http://localhost:5000/deleteHomePageInfo", params);
};
