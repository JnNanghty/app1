import mitt from "@/util/mitt";

if (window.cordova) {
  cordova.plugins.CordovaMqTTPlugin.connect({
    url: 'tcp://192.168.1.179',
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
