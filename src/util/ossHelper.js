import OSS from 'ali-oss';
import axios from "axios";
import ls from "@/store/ls";

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
                let url = ls.get('serviceUrl')
                axios.post(url + '/rest/ossCourse/getOssTicket', {
                    appName: 'wechatApp',
                    bucket: bucket || DEFAULT_OSS_BUCKET
                }).then((res) => {
                    if (res.data) {
                        let client = new OSS({
                            accessKeyId: String(res.data.stsAccessKeyId),
                            accessKeySecret: String(res.data.stsAccessKeySecret),
                            stsToken: String(res.data.stsSecurityToken),
                            region: String(res.data.ossEndPoint).replace('.aliyuncs.com', ''),
                            bucket: res.data.ossBucketName,
                            secure: true
                        });

                        client.expiration = new Date().setSeconds(new Date().getSeconds() + Number(res.data.stsExpiration));

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
