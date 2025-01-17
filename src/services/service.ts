import axios from "axios";

const apiUrl = "http://localhost:5000";

/**
 * Perform a GET request.
 * @param url Endpoint URL (relative to `apiUrl`).
 * @param params Query parameters.
 * @returns Axios response.
 */
export const get = async (url: string, params = {}) => {
  return axios.get(`${apiUrl + url}`, {
    params, // Pass params directly for GET requests
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Perform a POST request with support for JSON and FormData.
 * @param url Endpoint URL (relative to `apiUrl`).
 * @param params Request payload.
 * @returns Axios response.
 */
export const post = async (url: string, params: Record<string, any> = {}) => {
  // Determine whether payload contains files
  const isFile = (value: any) => value instanceof File || value instanceof Blob;

  const isNestedObject = (value: any) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

  const hasFiles = Object.values(params).some(
    (value) =>
      isFile(value) ||
      (Array.isArray(value) && value.some(isFile)) ||
      (isNestedObject(value) && Object.values(value).some(isFile))
  );

  let data: any;

  if (hasFiles) {
    const formData = new FormData();
    for (const key in params) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((item, index) =>
          formData.append(
            `${key}[${index}]`,
            isFile(item) ? item : JSON.stringify(item)
          )
        );
      } else if (isNestedObject(value)) {
        formData.append(key, JSON.stringify(value)); // Serialize nested objects
      } else {
        formData.append(key, value);
      }
    }
    data = formData;
  } else {
    data = JSON.stringify(params);
  }

  return axios.post(`${apiUrl + url}`, data, {
    headers: {
      "Content-Type": hasFiles ? undefined : "application/json", // Let Axios handle FormData headers
    },
  });
};

/**
 * Perform a DELETE request (mimicking POST behavior for payload).
 * @param url Endpoint URL (relative to `apiUrl`).
 * @param params Request payload.
 * @returns Axios response.
 */
export const deleteData = async (url: string, params = {}) => {
  return axios.post(`${apiUrl + url}`, JSON.stringify(params), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
