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
  let hasFileType = false;
  const formData = new FormData();

  // Check if any param value is an instance of File or Blob
  for (const key in params) {
    if (params[key] instanceof File || params[key] instanceof Blob) {
      hasFileType = true;
      formData.append(key, params[key]); // Add file data to FormData
    } else {
      formData.append(key, params[key]); // Add other form data
    }
  }

  // Choose the correct data format
  const data = hasFileType ? formData : { ...params };

  // Make the request with the appropriate content type
  return await axios({
    method: "post",
    url,
    data: data,
    headers: {
      "Content-Type": hasFileType ? "multipart/form-data" : "application/json",
    },
  });
};

export const deleteData = async (url: string, params = {}) => {
  return await axios({
    method: "post",
    url,
    data: { ...params },
    headers: {
      "Content-Type": "application/json",
    },
  });
};
