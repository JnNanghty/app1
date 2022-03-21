import mitt from "@/util/mitt";
import ls from "@/store/ls";

export function initMqtt() {
  if (window.cordova) {
    // 查找http://或https://后面的  非 空白 : / 字符， 并且  可能在端口号前 (:port) 的字符
    // 正则语法  ?<  android webview62 / chrome62版本后才支持  所以改用替换http(s):// 为空来解决
    // const regexp = /(?<=http(s)?:\/\/)[^\s|:\/]*(?=:[0-9]*)?/;
    const regexp = /(http(s)?:\/\/)[^\s|:\/]*(?=:[0-9]*)?/;
    const url = ls.get('serviceUrl');
    const mqttUrl = regexp.exec(url)[0].replace(/http(s?):\/\//, '');
    cordova.plugins.CordovaMqTTPlugin.connect({
      url: 'tcp://' + mqttUrl,
      port: 1883,
      clientId: 'device/' + window.device.uuid,
      success: function() {
        console.log("mqtt connect success");

        const topic = window.device.uuid + '/classcard/receive';
        cordova.plugins.CordovaMqTTPlugin.subscribe({
          topic: topic,
          qos: 0,
          success: function() {
            console.log('mqtt subscribe success');
            cordova.plugins.CordovaMqTTPlugin.listen(topic, function(payload, params) {
              //Callback:- (If the user has published to /topic/room/hall)
              //payload : contains payload data
              //params : {singlewc:room,multiwc:hall}
              console.log('mqtt receive data');
              console.log(payload);
              const data = JSON.parse(payload);
              if (data.type === 'config') {
                mitt.emit('mqttConfig', data.data); // 修改背景图和logo，模块的定制
              } else if (data.type === 'realTimeBroadcast') {
                mitt.emit('mqttRealTimeBroadcast', data.data); // 文字和持续时间
              } else if (data.type === 'programme') {
                mitt.emit('mqttProgramme', data.data); // 节目的话有文字加资源路径显示类型（图文，视频，音频）
              } else if (data.type === 'exam') {
                mitt.emit('mqttExam', data.data); // 考试，考试科目，考场号 考试开始结束时间
              } else if(data.type === 'info') {
                mitt.emit('mqttInfo', data.data) // 资讯
              } else if(data.type === '') {
                mitt.emit('mqtt')
              }
            })

          },
          error: function(e) {
            console.log('mqtt subscribe error');
          }
        });

      },
      error: function(e) {
        console.log("mqtt connect error");
      },
      onConnectionLost: function() {
        console.log("mqtt disconnect");
      }
    })
  }
}

export function disConnectMqtt() {
  if (window.cordova) {
    cordova.plugins.CordovaMqTTPlugin.disconnect();
  }
}
