<style lang="stylus" scoped>

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
    <div class="ci-classdesc">{{ terminalType }} / {{ terminalInfo.seatCount }}座</div>
    <p class="ci-manager">{{ terminalInfo.remark }}</p>
  </div>
</template>

<script>
export default {
  name: "ClassroomInfo",
  props: ['terminalInfo'],
  data() {
    return {
      terminalTypeList: [
        { id: 7, name: 'media', label: '多媒体教室' },
        { id: 1, name: 'wisdom', label: '智慧教室' },
        { id: 3, name: 'record', label: '录播教室' },
        { id: 4, name: 'computer', label: '计算机教室' },
        { id: 2, name: 'experiment', label: '实验实训室' },
        { id: 5, name: 'art', label: '功能教室' },
        { id: 6, name: 'other', label: '其他' }
      ]
    }
  },
  created() {
  },
  computed: {
    terminalType() {
      let label = ''
      this.terminalTypeList.forEach(i => {
        if(i.id === this.terminalInfo.type) {
          label = i.label
        }
      })
      return label;
    }
  },
  mounted() {
  },
  methods: {}
}
</script>

