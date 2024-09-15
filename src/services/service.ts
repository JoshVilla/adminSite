import axios from "axios";

export const get = async (url: string, params = {}) => {
  return await axios({
    method: "get",
    url,
    data: { ...params },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const post = async (url: string, params = {}) => {
  return await axios({
    method: "post",
    url,
    data: { ...params },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteApi = async (url: string, params = {}) => {
  return await axios({
    method: "delete",
    url,
    data: { ...params },
    headers: {
      "Content-Type": "application/json",
    },
  });
};
