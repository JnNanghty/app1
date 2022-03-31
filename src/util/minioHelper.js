import axios from "axios";
import ls from "@/store/ls";
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
                let url = ls.get('serviceUrl')
                axios.post(url + '/rest/fileConfig/getMinioTicket').then((res) => {
                    if (res.data && res.data.__result) {
                        this.client = new Minio.Client({
                            endPoint: res.data.__result.endpoint.split(':')[0],
                            port: Number(res.data.__result.endpoint.split(':')[1]),
                            useSSL: false,
                            accessKey: res.data.__result.accessKey,
                            secretKey: res.data.__result.secretKey
                        });
                        this.client.expiration = new Date(res.data.__result.Expiration).getTime();
                        resolve(this.client);
                    }
                });
            }
        });
    },
    // 弃用。使用getDownloadUrl获取
    getFile(bucket, file) {
        return new Promise((resolve) => {
            this.client.presignedUrl('GET', bucket, file, 3600, (err, presignedUrl) => {
                resolve(presignedUrl);
            });
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
