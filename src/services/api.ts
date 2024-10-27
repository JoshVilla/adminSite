import { deleteData, get, post } from "./service";

export const getAdmins = (params = {}) => {
  return post(`/get`, params);
};

export const loginApi = (params: {}) => {
  return post(`/login`, params);
};

export const addAdmin = (params: {}) => {
  return post(`/addAdmin`, params);
};

export const deleteAdmin = (params: {}) => {
  return deleteData(`/delete`, params);
};

export const saveAdmin = (params: {}) => {
  return post(`/save`, params);
};

export const siteInfo = (params: {}) => {
  return get(`/siteInfo`, params);
};

export const siteInfoUpdate = (params: {}) => {
  return post(`/siteInfoUpdate`, params);
};

export const homepageInfo = (params: {}) => {
  return get(`/homepageInfo`, params);
};

export const addHomepageInfo = (params: {}) => {
  return post(`/addHomePageInfo`, params);
};

export const deleteHomepageInfo = (params: {}) => {
  return post(`/deleteHomePageInfo`, params);
};

export const updateHomepageInfo = (params: {}) => {
  return post(`/updateHomepageInfo`, params);
};

export const addStory = (params: {}) => {
  return post(`/addStory`, params);
};

export const getStory = (params: {}) => {
  return post(`/topStoriesInfo`, params);
};

export const deleteStory = (params: {}) => {
  return post(`/deleteStory`, params);
};

export const updateStory = (params: {}) => {
  return post(`/updateStory`, params);
};

export const updateDisplayStory = (params: {}) => {
  return post(`/updateDisplayStory`, params);
};

export const getOfficials = (params: {}) => {
  return post(`/getOfficials`, params);
};

export const addOfficials = (params: {}) => {
  return post(`/addOfficial`, params);
};

export const deleteOfficial = (params: {}) => {
  return post(`/deleteOfficial`, params);
};
