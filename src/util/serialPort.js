// 初始化读卡器  注册回调
import mitt from "@/util/mitt";

function arrayBuffer2string(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

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
      mitt.emit('brushCard', data.toString(16));
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
    const count = Number(dataArray[0]);
    const data = parseInt(arrayBuffer2string(res.slice(1)));
    handler.handle({
      count,
      data
    });
  })
}


