// 初始化读卡器  注册回调
import mitt from "@/util/mitt";

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
    const {count, data} = message;
    if(count === this.next) {
      let ic = ''
      console.log(data);
      console.log(typeof data);
      data.forEach(d => {
        console.log(d);
        ic += d.toString(16);
      });
      console.log(ic);
      mitt.emit('brushCard', ic);
      this.lastCount = count;
      if(this.messages.has(count)) {
        this.messages.delete(count)
      }
      if(this.messages.size && this.messages.has(this.next)) {
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
}


