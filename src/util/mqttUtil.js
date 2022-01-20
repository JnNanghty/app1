if (window.cordova) {
  cordova.plugins.CordovaMqTTPlugin.connect({
    url: "tcp://192.168.1.179", //a public broker used for testing purposes only. Try using a self hosted broker for production.
    port: 1883,
    clientId: 'device/' + window.device.uuid,
    success: function() {
      console.log("mqtt connect success");

      cordova.plugins.CordovaMqTTPlugin.subscribe({
        topic: window.device.uuid + '/classcard/receive',
        qos: 0,
        success: function(s) {
          console.log(JSON.stringify(s));
          console.log('mqtt subscribe success');
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
