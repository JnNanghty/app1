import ossHelper from './ossHelper';
import minioHelper from './minioHelper';
import axios from "axios";
import ls from "@/store/ls";

export default {
  useOss: undefined,
  getConfig() {
    let url = ls.get('serviceUrl')
    return axios.post(url + '/rest/fileConfig/getConfig', {}).then((res) => {
      this.useOss = res.data.__result.fileServer === 'oss';
    });
  },
  getFile(filePath, folder, bucket) {
    return new Promise((resolve, reject) => {
      let path = folder ? folder + filePath : filePath;
      if (ossHelper.isOssFile(path)) {
        ossHelper.getDownloadUrl(bucket, path).then((url) => {
          resolve(url);
        });
      } else if (minioHelper.isMinioFile(path)) {
        minioHelper.getDownloadUrl(bucket, path).then((url) => {
          resolve(url);
        });
      } else {
        reject();
      }
    });
  },
};
