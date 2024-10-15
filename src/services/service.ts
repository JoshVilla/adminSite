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
    // Handle objects by checking for nested structures
    else if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        // If it's an array, append each item individually
        value.forEach((item, index) => {
          formData.append(
            `${key}[${index}]`,
            item instanceof File ? item : JSON.stringify(item)
          );
        });
        hasFileType = true;
      } else {
        // If it's an object, check if it contains any file
        const hasNestedFile = Object.values(value).some(
          (v) => v instanceof File || v instanceof Blob
        );
        if (hasNestedFile) {
          formData.append(key, JSON.stringify(value)); // Add JSON if necessary
          hasFileType = true;
        } else {
          // This allows simpler nested objects to be sent as JSON in regular request
          formData.append(key, JSON.stringify(value)); // Serialize objects to JSON
        }
      }
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
      // No need to set Content-Type explicitly for FormData, Axios will handle it
      "Content-Type": hasFileType ? undefined : "application/json",
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
