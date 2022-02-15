// 初始化读卡器  注册回调
import mitt from "@/util/mitt";
import {ByteStringBuffer} from "node-forge/lib/util";

function arrayBuffer2string(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
// LED熄灭        AA12000055
// LED红灯常亮     AA13010155
// LED绿灯常亮     AA13010255
// LED蓝灯常亮     AA13010355
// LED红闪烁       AA14010155
// LED绿闪烁       AA14010155
// LED蓝闪烁       AA14010355
// LED跑马灯       AA15000055

if (window.serialPortPlugin) {
  // /dev/ttyS3   波特率9600
  window.serialPortPlugin.init(3, 9600, res => {
    console.log('serialPort插件init success');
    // 要把ic卡转成16进制字符串
    const ic = parseInt(arrayBuffer2string(res));
    mitt.emit('brushCard', ic.toString(16));


    let cmd = new Uint8Array([0xAA, 0x13, 0x01, 0x01, 0x55]);
    window.serialPortPlugin.send(cmd, 3);
  }, err => {
    console.log('serialPort插件init error:');
    console.log(JSON.stringify(err));
  })
}
