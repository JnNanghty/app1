<style scoped lang="stylus">
.main-content {
  display: flex;
  color #fff;
  height: 100%;
  width: 100%

  .main-left {
    margin-right: 0.75rem
  }

  .main-left,
  .main-right {
    flex: 1;
    background: rgba(66, 72, 81, 0.25);
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
  background: #424851;
  width: 16.45rem
  border-radius 0.4rem
  height: 2rem
  padding-left: 0.6rem
  border: none
}

.form-select {
  border-radius 0.4rem
  height: 2rem
  border: none
  padding-left: 0.6rem
  width 6.4rem
  background: #424851 url("../../../assets/icon/down.png") @width - 1.25rem 0.6rem / 0.8rem 0.8rem no-repeat;
  appearance: none;
  color #fff;
}

.form-select-big-size {
  width: 17.05rem
  background: #424851 url("../../../assets/icon/down.png") @width - 1.25rem 0.6rem / 0.8rem 0.8rem no-repeat;
}

.submit-button {
  text-align center;
  background-color: #FDA45E;
  border-radius 0.4rem;
  width: 15.5rem
  height: 2rem
  line-height @height;
  bottom: 0.85rem
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
