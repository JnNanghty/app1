<style lang="stylus" scoped>
@import "~@/theme/mixin.styl";

.ci-main {
  position relative;
  height: 150px;
  padding-left: 36px;
  max-width: 450px;
  get_font_color(font_color);

  &::before {
    content: '';
    display: block;
    width: 12px;
    height: 100%;
    background: #FDA45E;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.ci-terminal-label {
  font-size 56px;
  font-weight 200;
  margin-bottom: 7px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
}

.ci-classdesc {
  font-size 20px;
  font-weight 200
  margin-bottom: 8px
}

.ci-manager {
  font-size 20px;
}
</style>
<template>
  <div class="ci-main">
    <h1 class="ci-terminal-label">{{ terminalInfo.label }}</h1>
    <div class="ci-classdesc">教室描述123123 / {{ terminalInfo.seatCount }}座</div>
    <p class="ci-manager">管理员：</p>
  </div>
</template>

<script>
export default {
  name: "ClassroomInfo",
  props: ['terminalInfo'],
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

