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

export const addHomepageInfo = (params: {}) => {
  return post("http://localhost:5000/addHomePageInfo", params);
};

export const deleteHomepageInfo = (params: {}) => {
  return post("http://localhost:5000/deleteHomePageInfo", params);
};

export const updateHomepageInfo = (params: {}) => {
  return post("http://localhost:5000/updateHomepageInfo", params);
};

export const addStory = (params: {}) => {
  return post("http://localhost:5000/addStory", params);
};

export const getStory = (params: {}) => {
  return post("http://localhost:5000/topStoriesInfo", params);
};

export const deleteStory = (params: {}) => {
  return post("http://localhost:5000/deleteStory", params);
};

export const updateStory = (params: {}) => {
  return post("http://localhost:5000/updateStory", params);
};
