<style scoped lang="stylus">
.main-content {
  display: flex;
  color #fff;
  height: 100%;
  width: 100%

  .main-left {
    margin-right: 13px
  }

  .main-left,
  .main-right {
    flex: 1;
    background: rgba(66, 72, 81, 0.25);
    border-radius 7px;
    padding-top: 14px
    padding-left: 25px
    position relative
  }
}

.form-content {
  margin-left: 11px
}

.form-title {
  margin-bottom: 23px
}

.form-row {
  display flex;

  .form-item-inline {
    flex: 1
  }
}

.form-item {
  margin-bottom: 17px
}

.form-item-inline {
  margin-bottom: 11px
  display flex;

  .form-label {
    width 50px;
    white-space nowrap;
    margin-right: 13px
    line-height 40px;
    text-align right
  }
}

.form-label {
  margin-bottom: 7px
  font-size 14px;
}

.form-input {
  background: #424851;
  width: 329px;
  border-radius 8px;
  height: 40px
  padding-left: 12px
  border: none
}

.form-select {
  border-radius 8px;
  height: 40px
  border: none
  padding-left: 12px
  width 128px;
  background: #424851 url("../../../assets/icon/down.png") @width - 25px 12px / 16px 16px no-repeat;
  appearance: none;
  color #fff;
}

.form-select-big-size {
  width: 341px
  background: #424851 url("../../../assets/icon/down.png") @width - 25px 12px / 16px 16px no-repeat;
}

.submit-button {
  text-align center;
  background-color: #FDA45E;
  border-radius 8px;
  width: 310px
  height: 40px
  line-height @height;
  bottom: 17px
  position absolute
  left: 0
  right: 0
  margin: 0 auto;
}
</style>
<template>
  <div class="main-content">
    <div class="main-left">
      <h3 class="form-title">网络信息</h3>
      <form class="form-content">
        <div class="form-item-inline">
          <div class="form-label">ip获取</div>
          <select class="form-select form-select-big-size" v-model="systemInfo.ip">
            <option v-for="item in selectOption.school" :value="item.id" :label="item.label"></option>
          </select>
        </div>
        <div class="form-item-inline">
          <div class="form-label">ip地址</div>
          <input class="form-input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">子网掩码</div>
          <input class="form-input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">网关</div>
          <input class="form-input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">首选DNS</div>
          <input class="form-input">
        </div>
        <div class="form-item-inline">
          <div class="form-label">备用DNS</div>
          <input class="form-input">
        </div>
        <div>
          <div>取消</div>
          <div class="submit-button">保存</div>
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
