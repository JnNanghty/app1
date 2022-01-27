// 初始化读卡器  注册回调
import mitt from "@/util/mitt";

function arrayBuffer2string(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

if (window.serialPortPlugin) {
  // /dev/ttyS3   波特率9600
  window.serialPortPlugin.init(3, 9600, res => {
    console.log('serialPort插件init success');
    // 要把ic卡转成16进制字符串
    const ic = parseInt(arrayBuffer2string(res));
    mitt.emit('brushCard', ic.toString(16));
  }, err => {
    console.log('serialPort插件init error:');
    console.log(JSON.stringify(err));
  })
}
