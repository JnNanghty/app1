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
  margin-bottom: 1.15rem
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
    line-height 2rem
    text-align right
  }
}

.form-label {
  margin-bottom: 0.35rem
  font-size 0.7rem
}

.form-input {
  width: 16.45rem
  height: 2rem
}

.form-select {
  height: 2rem
  width 6.4rem
}

.form-select-big-size {
  width: 17.05rem
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
          <select class="form-select _select form-select-big-size" v-model="systemInfo.ipGetWay">
            <option value="1" label="自动"></option>
            <option value="2" label="手动"></option>
          </select>
        </div>
        <div class="form-item-inline">
          <div class="form-label">ip地址</div>
          <input class="form-input _input" v-model="systemInfo.ip">
        </div>
        <div class="form-item-inline">
          <div class="form-label">子网掩码</div>
          <input class="form-input _input" v-model="systemInfo.mask">
        </div>
        <div class="form-item-inline">
          <div class="form-label">网关</div>
          <input class="form-input _input" v-model="systemInfo.gateWay">
        </div>
        <div class="form-item-inline">
          <div class="form-label">首选DNS</div>
          <input class="form-input _input" v-model="systemInfo.dns">
        </div>
<!--        <div class="form-item-inline">-->
<!--          <div class="form-label">备用DNS</div>-->
<!--          <input class="form-input _input">-->
<!--        </div>-->
        <div class="submit-button">
          <div class="_button cancel-button" @click="cancel">取消</div>
          <div class="_button" style="margin-left: 2rem" @click="save">保存</div>
        </div>
      </form>
    </div>
    <div class="main-right">
      <h2 class="form-title">系统操作</h2>
      <div class="option-button cancel-button  _button" @click="exit">退出应用</div>
      <div class="option-button _button">显示底部工具栏</div>
    </div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import {msg} from "@/components/message";

export default {
  name: "SystemSetting",
  data() {
    return {
      systemInfo: {
        ipGetWay:'',
        ip: '',
        dns: '',
        mask: '',
        gateWay: ''
      }
    }
  },
  created() {
    let info = ls.get('systemInfo')
    if(info) {
      this.systemInfo = JSON.parse(info);
    }
  },
  methods: {
    exit() {
      if (window.cordova) {
        cordova.plugins.exit();
      }
    },
    cancel() {
      for(let i in this.systemInfo) {
        this.systemInfo[i] = ''
      }
    },
    save() {
      ls.set('systemInfo', JSON.stringify(this.systemInfo))
      msg({
        message: '保存成功！',
        type: 'success'
      });
    }
  }
}
</script>
