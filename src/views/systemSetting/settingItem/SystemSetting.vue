<style scoped lang="stylus">
.main-content {
  display: flex;
  get_font_color(font_color)
  height: 100%;
  width: 100%

  .main-left {
    margin-right: 0.75rem
  }

  .main-left,
  .main-right {
    flex: 1;
    get_background(setting_panel_bancground)
    border-radius 0.35rem
    padding-top: 0.7rem
    padding-left: 1.25rem
    position relative
  }
}

.form-content {
  margin-left: 0.55rem
}

.form-title {
  margin-bottom: 0.85rem
  font-size 0.7rem;
}

.form-row {
  display flex;

  .form-item-inline {
    flex: 1
  }
}

.form-item {
  margin-bottom: 0.85rem
}

.form-item-inline {
  margin-bottom: 0.55rem
  display flex;

  .form-label {
    width 2.5rem
    white-space nowrap;
    margin-right: 0.65rem
    line-height 1.7rem
    text-align right
  }

  .form-select {
    width: 17.05rem
    height: 1.7rem
    line-height @height
  }
}

.form-label {
  font-size 0.7rem
}

.form-input {
  width: 16.45rem
  height: 1.7rem
  line-height 1.7rem;
  font-size .8rem;
  border-radius .4rem;
  padding-left: 0.6rem
}

.submit-button {
  position absolute
  width: 75%
  bottom: 0.85rem
  left: 0
  right: 0
  margin: 0 auto;
  display flex
  justify-content space-around

  div {
    flex: 1
  }
}

.cancel-button {
  get_background(input_background)
}

.option-button
  width: 50%
  margin: 0 0 2rem 2rem

</style>
<template>
  <div class="main-content">
    <div class="main-left">
      <h3 class="form-title">网络信息</h3>
      <form class="form-content">
        <div class="form-item-inline">
          <div class="form-label">ip获取</div>
          <my-select class="form-select _select" :len="2" :value="modeLabel">
            <my-option @select="selectMode({label: 'DHCP', value: 'DHCP'})" value="DHCP" label="DHCP"></my-option>
            <my-option @select="selectMode({label: '静态', value: 'StaticIp'})" value="StaticIp" label="静态"></my-option>
          </my-select>
        </div>
        <div class="form-item-inline">
          <div class="form-label">ip地址</div>
          <div v-if="ipReadOnly" class="form-input">{{ systemInfo.ip }}</div>
          <input v-else class="form-input _input" v-model="systemInfo.ip">
        </div>
        <div class="form-item-inline">
          <div class="form-label">子网掩码</div>
          <div v-if="ipReadOnly" class="form-input">{{ systemInfo.mask }}</div>
          <input v-else class="form-input _input" v-model="systemInfo.mask">
        </div>
        <div class="form-item-inline">
          <div class="form-label">网关</div>
          <div v-if="ipReadOnly" class="form-input">{{ systemInfo.gateWay }}</div>
          <input v-else class="form-input _input" v-model="systemInfo.gateWay">
        </div>
        <div class="form-item-inline">
          <div class="form-label">首选DNS</div>
          <div v-if="ipReadOnly" class="form-input">{{ systemInfo.dns1 }}</div>
          <input v-else class="form-input _input" v-model="systemInfo.dns1">
        </div>
        <div class="form-item-inline">
          <div class="form-label">备用DNS</div>
          <div v-if="ipReadOnly" class="form-input">{{ systemInfo.dns2 }}</div>
          <input v-else class="form-input _input" v-model="systemInfo.dns2">
        </div>
        <div class="submit-button">
          <div class="_button cancel-button" @click="cancel">取消</div>
          <div class="_button" style="margin-left: 2rem" @click="save">保存</div>
        </div>
      </form>
    </div>
    <div class="main-right">
      <h2 class="form-title">系统操作</h2>
      <div class="option-button cancel-button  _button" @click="exit">退出应用</div>
      <div class="option-button _button" @click="showStatusBar">显示状态栏</div>
    </div>
  </div>
</template>

<script>
import {msg} from "@/components/message";

export default {
  name: "SystemSetting",
  data() {
    return {
      modeLabel: '',
      systemInfo: {
        mode: '',
        ip: '',
        dns1: '',
        dns2: '',
        mask: '',
        gateWay: ''
      }
    }
  },
  computed: {
    ipReadOnly() {
      return this.systemInfo.mode === 'DHCP'
    }
  },
  created() {
    if (window.banpaiTools) {
      window.banpaiTools.ipConfig(res => {
        console.log('ipConfig');
        console.log(res);
        this.systemInfo = res;
        if (res.mode === 'DHCP') {
          this.modeLabel = 'DHCP'
        } else {
          this.modeLabel = '静态';
        }
      });
    }
  },
  methods: {
    selectMode(item) {
      this.modeLabel = item.label;
      this.systemInfo.mode = item.value;
    },
    exit() {
      this.showStatusBar();
      if (window.banpaiTools) {
        window.banpaiTools.exit()
      }
      // 关闭灯光
      if (window.serialPortPlugin) {
        let cmd = new Uint8Array([0xAA, 0x12, 0x00, 0x00, 0x55]);
        window.serialPortPlugin.send(cmd, 3);
      }
      if (window.cordova) {
        cordova.plugins.exit();
      }
    },
    cancel() {
      for (let i in this.systemInfo) {
        i !== 'mode' && (this.systemInfo[i] = '')
      }
    },
    save() {
      if (window.banpaiTools) {
        let ipConfig = this.systemInfo;
        window.banpaiTools.setIpConfig(ipConfig);
      }
      msg({
        message: '保存成功！',
        type: 'success'
      });
    },
    showStatusBar() {
      if (window.banpaiTools) {
        window.banpaiTools.setSystemBar(false)
      }
    }
  }
}
</script>
