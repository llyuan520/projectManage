import axios from "axios";
// scAxios.defaults.baseURL = APIV1;
// scAxios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import scAxios from "@sc/request";

export default function request(url, option) {
  return scAxios(url, option).then(response => {
    const { statusCode:code, message:msg, data } = response
    return Promise.resolve({ msg, data, code })
  }).catch(error => {
    const { response } = error
    let msg,statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || 'Network Error'
    }
    /* eslint-disable */
    return Promise.resolve({ success: false, statusCode, message: msg })
    // return response
  });
}