import axios from "axios";

export default function ajax(method, url, data, jwt) {
  const options = {
    method,
    url,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (jwt) {
    options.headers.Authorization = `Bearer ${jwt}`;
  }

  return axios(options);
}

export function fileAjax(method, url, data, jwt) {
  const options = {
    method,
    url,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  if (jwt) {
    options.headers.Authorization = `Bearer ${jwt}`;
  }

  return axios(options);
}
