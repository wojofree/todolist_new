import axios from 'axios';
axios.defaults.withCredentials = true
let regex = /.*csrftoken=([^;.]*).*$/;
axios.defaults.headers.post['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'
/**
 * axios 实例
 */
const apiHttpClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export {
  apiHttpClient
}