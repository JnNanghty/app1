import OSS from 'ali-oss';
import axios from "axios";
import ls from "@/store/ls";
import service from "@/api/services";
import forge from "node-forge";

const DEFAULT_OSS_BUCKET = 'hzmaijie-course';

export default {
  ticket: {},
  client: null,
  isOssFile(fileName) {
    return fileName.startsWith('oss:');
  },
  getObjectWithTicket(fileName, ticket) {
    let client = new OSS({
      accessKeyId: ticket.stsAccessKeyId || ticket.StsAccessKeyId,
      accessKeySecret: ticket.stsAccessKeySecret || ticket.StsAccessKeySecret,
      stsToken: ticket.stsSecurityToken || ticket.StsSecurityToken,
      region: (ticket.ossEndPoint || ticket.OssEndPoint).replace('.aliyuncs.com', ''),
      bucket: ticket.ossBucketName || ticket.OssBucketName,
      secure: true
    });

    fileName = fileName.replace('oss:', '');
    return client.signatureUrl(fileName, {
      expires: 3600
    });
  },
  getClient(bucket) {
    return new Promise((resolve) => {
      if (this.client && this.client.expiration < new Date().getTime()) {
        resolve(this.client);
      } else {
        const md5 = forge.md.md5.create();
        md5.update(Math.floor(Date.now() / 1000) + 'course2018ossHzmj');
        let key = md5.digest().toHex().toUpperCase();
        service.post('ossCourse/getOssTicketWithKey', {
          appName: 'classcard',
          bucket: bucket || DEFAULT_OSS_BUCKET,
          key: key
        }).then((res) => {
          if (res) {
            let client = new OSS({
              accessKeyId: String(res.stsAccessKeyId),
              accessKeySecret: String(res.stsAccessKeySecret),
              stsToken: String(res.stsSecurityToken),
              region: String(res.ossEndPoint).replace('.aliyuncs.com', ''),
              bucket: res.ossBucketName,
              secure: true
            });

            client.expiration = new Date().setSeconds(new Date().getSeconds() + Number(res.stsExpiration));

            this.client = client;
            resolve(client);
          }
        });
      }
    });
  },
  // 下载
  getDownloadUrl(bucket, file) {
    return new Promise((resolve) => {
      this.getClient(bucket).then((client) => {
        file = file.replace('oss:', '');
        let url = client.signatureUrl(file, {
          expires: 3600
        });
        resolve(url);
      });
    });
  },
};
