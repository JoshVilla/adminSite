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

export const post = async (url: string, params: Record<string, any> = {}) => {
  let hasFileType = false;
  const formData = new FormData();

  for (const key in params) {
    const value = params[key];

    // Handle files or blobs
    if (value instanceof File || value instanceof Blob) {
      hasFileType = true;
      formData.append(key, value); // Add file to FormData
    }
    // Handle objects (like 'accounts') by stringifying them to JSON
    else if (typeof value === "object" && value !== null) {
      hasFileType = true;
      formData.append(key, JSON.stringify(value)); // Serialize objects to JSON
    }
    // Handle primitive types (string, number, boolean)
    else {
      formData.append(key, value);
    }
  }

  // Decide whether to use FormData or raw JSON depending on the presence of file uploads
  const data = hasFileType ? formData : JSON.stringify(params);

  // Make the request with the appropriate headers
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
