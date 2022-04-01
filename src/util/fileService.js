import ossHelper from './ossHelper';
import minioHelper from './minioHelper';

export default {
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
