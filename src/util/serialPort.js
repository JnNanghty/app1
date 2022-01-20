// 初始化读卡器  注册回调
import mitt from "@/util/mitt";
export function initCardReader() {
  if (window.serialPortPlugin) {
    window.serialPortPlugin.init(3, 9600, res => {
      console.log('插件init success');
      console.log(res);
      console.log(JSON.stringify(res));
      mitt.emit('brushCard');
    }, err => {
      console.log('插件init error');
      console.log(err);
      console.log(JSON.stringify(err));
    })
  }
}
