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
  .cancel-button {
    get_background(input_background)
  }
}
</style>
<template>
  <div class="main-content">
    <div class="main-left">
      <h3 class="form-title">网络信息</h3>
      <form class="form-content">
        <div class="form-item-inline">
          <div class="form-label">ip获取</div>
          <select class="form-select _select form-select-big-size" v-model="systemInfo.ip">
            <option v-for="item in selectOption.school" :value="item.id" :label="item.label"></option>
          </select>
        </div>
        <div class="form-item-inline">
          <div class="form-label">ip地址</div>
          <input class="form-input _input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">子网掩码</div>
          <input class="form-input _input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">网关</div>
          <input class="form-input _input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">首选DNS</div>
          <input class="form-input _input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">备用DNS</div>
          <input class="form-input _input">
        </div>
        <div class="submit-button">
          <div class="_button cancel-button">取消</div>
          <div class="_button" style="margin-left: 2rem">保存</div>
        </div>
      </form>
    </div>
    <div class="main-right">
      <h2 class="form-title">当前绑定教室信息</h2>

    </div>
  </div>
</template>

<script>
export default {
  name: "SystemSetting",
  data() {
    return {
      systemInfo: {
        ip: ''
      },
      selectOption: {
        ip: []
      }
    }
  },
  methods: {}
}
</script>
