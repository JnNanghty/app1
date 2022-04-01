import axios from "axios";
import ls from "@/store/ls";
import service from "@/api/services";
import forge from "node-forge";

const Minio = require('minio')
const DEFAULT_MINIO_BUCKET = 'hzmaijie-course';

export default {
  client: null,
  isMinioFile(fileName) {
    return fileName.startsWith('minio:');
  },
  // 弃用。使用getUploadUrl、getDownloadUrl上传下载
  getClient() {
    return new Promise((resolve) => {
      if (this.client && this.client.expiration < new Date().getTime()) {
        resolve(this.client);
      } else {
        const md5 = forge.md.md5.create();
        md5.update(Math.floor(Date.now() / 1000) + 'zxkjminio');
        let key = md5.digest().toHex().toUpperCase();
        service.post('fileConfig/getMinioTicketWithKey', {
          key: key
        }).then((res) => {
          if (res && res.__result) {
            this.client = new Minio.Client({
              endPoint: res.__result.endpoint.split(':')[0],
              port: Number(res.__result.endpoint.split(':')[1]),
              useSSL: false,
              accessKey: res.__result.accessKey,
              secretKey: res.__result.secretKey
            });
            this.client.expiration = new Date(res.__result.Expiration).getTime();
            resolve(this.client);
          }
        });
      }
    });
  },
  // 下载
  getDownloadUrl(bucket, file) {
    return new Promise((resolve) => {
      file = file.replace('minio:', '');
      let url = ls.get('serviceUrl')
      axios.post(url + '/rest/fileConfig/downloadMinioPreSignedUrl', {
        bucket: bucket || DEFAULT_MINIO_BUCKET,
        objectName: file
      }).then((res) => {
        if (res.data.__result) {
          resolve(res.data.__result);
        }
      });
    });
  },
};
