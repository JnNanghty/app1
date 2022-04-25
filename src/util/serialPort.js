// 初始化读卡器  注册回调
import mitt from "@/util/mitt";
import {msg} from "@/components/message";

class Handler {
  constructor() {
    this.messages = new Map();
    this.lastCount = -1;
  }

  get next() {
    let count = this.lastCount + 1;
    return count > 99 ? count - 100 : count;
  }

  handle(message) {
    const {count, dataArray} = message;
    if (count === this.next) {
      let arr = dataArray.map(d => {
        return d.toString(16);
      });
      console.log(arr);
      let ic = '';
      arr.forEach(i => {
        if (i < 10) {
          i = '0' + i;
        }
        ic += i;
      });
      console.log('ic:' + ic);
      if (ic === 'aabb0600000001060007') {
        msg({
          message: '串口初始化成功！',
          type: 'success'
        })
      } else {
        mitt.emit('brushCard', ic);
      }
      this.lastCount = count;
      if (this.messages.has(count)) {
        this.messages.delete(count)
      }
      if (this.messages.size && this.messages.has(this.next)) {
        this.handle(this.messages.get(this.next));
      }
    } else {
      this.messages.set(count, message);
    }
  }
}

const handler = new Handler()
if (window.serialPortPlugin) {
  // /dev/ttyS3   波特率9600
  window.serialPortPlugin.init(3, 9600, res => {
    const dataArray = Array.from(new Uint8Array(res));
    const count = +dataArray.shift();
    console.log(count)
    console.log(dataArray)
    handler.handle({
      count,
      dataArray
    });
  })
  let cmd = new Uint8Array([0xaa, 0xbb, 0x06, 0x00, 0x00, 0x00, 0x01, 0x06, 0x03, 0x04]);
  window.serialPortPlugin.send(cmd, 3);
}


