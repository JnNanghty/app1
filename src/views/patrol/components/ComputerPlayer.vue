<style scoped>
.wrapped-computer-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.computer-player-container {
  width: 100%;
  height: 100%;
}
.computer-player-container img{
  width: 100%;
  height: 100%;
}
.computer-player-container p{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 18px;
  color: #000;
  background-color: #999;
}

.pc-refresh {
  background-color: #FFF;
  position: absolute;
  font-size: 16px;
  top: 2px;
  right: 2px;
  padding: 5px;
  box-shadow: 0 0 3px #000;
  cursor: pointer;
}

.pc-refresh:hover {
  background-color: #DFDFDF;
}
</style>

<template>
  <div class="wrapped-computer-container">
    <div class="computer-player-container">
      <img :src="src" alt="" v-if="src">
      <p v-else-if="loading">
        电脑画面加载中...
      </p>
      <p v-else>
        暂无电脑画面
        <i class="fa fa-refresh pc-refresh" @click.stop="refreshPC"></i>
      </p>
    </div>
  </div>
</template>

<script>
import service from "@/api/services";
import ls from "@/store/ls";

export default {
  name: 'computer-player',
  props: {
    computer: {
      required: true
    },
    /** 电脑开机状态 */
    power: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      src: '',
      hasPCSrc: false, // 是否有电脑的画面
      interval: null,
      lastestTimestamp: null, // 最近一次接口返回的时间\
      loading: this.power // 是否处于loading状态  初始状态和power一致
    };
  },
  watch: {
    power: function(newVal, oldVal) { // 切换电脑开关
      // 初始化不触发, 无电脑不触发
      if (oldVal === undefined || !this.computer.id) {
        return;
      }
      if (newVal) {
        this.initPC();
      } else {
        clearInterval(this.interval);
        this.interval = null;
        this.hasPCSrc = false;
        this.loading = false;
      }
    },
    'computer.id': {
      // 组件异步加载的 监听computer的变化 如果有id同时电脑为开机状态 加载画面
      handler: function(newId) {
        if (newId && this.power) {
          this.initPC();
        }
      }
    }
  },
  computed: {
  },
  mounted: function() {
    // 如果组件不是异步加载的 初始化时直接传入computer
    if (this.computer && this.computer.id) {
      if (this.power) {
        // 电脑是开机状态的 则初始化电脑画面
        this.initPC();
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  methods: {
    initPC: function() {
      this.src = '';
      this.loading = true;
      this.getPcStatus();
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(this.getPcStatus, 5 * 1000);
    },
    getPcStatus: function(isForce) {
      let timestamp = Date.now();

      service.post('control/getPCCurrentInfo', {
        deviceId: this.computer.id,
        isForce: !!isForce
      }).then((result) => {
        // 电脑关机状态 即使获得图片 也不处理
        if (!this.power) {
          return;
        }
        if (!this.lastestTimestamp) {
          this.lastestTimestamp = timestamp;
        }
        if (timestamp < this.lastestTimestamp) {
          return;
        }
        let currentInfo = result || {};
        if (currentInfo.screenImage) {
          this.hasPCSrc = true;
          let serviceUrl = ls.get('serviceUrl') || ''
          this.src = serviceUrl + currentInfo.screenImage;
        } else {
          this.hasPCSrc = false;
        }
        this.loading = false;
      });
    },

    refreshPC: function() {
      clearInterval(this.interval);
      this.src = '';
      this.interval = window.setInterval(() => {
        this.getPcStatus(true);
      }, 5 * 1000);
    }
  }
};
</script>
