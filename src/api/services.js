import axios from 'axios';
import {getToken} from "@/util/auth";
// import {msg} from "@/components/message";
import forge from 'node-forge';
import ls from "@/store/ls";

const serverUrl = '';

let service = axios.create({
  baseURL: serverUrl + '/rest/',
  timeout: 10000,
});

service.interceptors.request.use(config => {
  let serviceUrl = ls.get('serviceUrl');
  if (process.env.NODE_ENV === 'development') {
    serviceUrl = ''
  }
  config.baseURL = serviceUrl + '/rest/';

  const token = getToken();
  if (token) {
    config.headers['token'] = value;
  }

  const companyId = ls.get('companyId') || 0;

  const extraData = {
    companyId, timestamp: Math.floor(Date.now() / 1000), key: ''
  };

  const md5 = forge.md.md5.create();
  md5.update(extraData.companyId + extraData.timestamp + 'classcard');
  extraData.key = md5.digest().toHex().toUpperCase();

  const data = config.data || {};
  config.data = Object.assign(data, extraData);


  return config;
});

service.interceptors.response.use(res => {
  let {data} = res;
  return data;
}, error => {
  // msg({
  //   message: '请求失败！'
  // });
  return Promise.reject(error);
});


export default service;
