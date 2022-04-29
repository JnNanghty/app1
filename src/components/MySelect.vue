<style lang="stylus" scoped>
.__select-main
  get_background(select_background)
  get_font_color(font_color)
  padding-left: 0.6rem
  border-radius .4rem
  width fit-content
  min-width 6rem;
  font-size .8rem;
  position relative
  height: 2rem
  line-height @height
  display inline-block
  box-sizing border-box

  &:focus
    get_background(select_background_focus)

  .__select-value
    width: 100%
    height: 100%
    white-space nowrap

.__select-wrap
  position absolute
  top: 0
  left: 0
  z-index 5000
  min-width 7rem
  border-radius .4rem
  max-height: 8rem;
  overflow-y: scroll;
  overflow-x: hidden;
</style>

<template>
  <div class="__select-main" ref="select" tabindex="0" @click="show" v-clickoutside="hide">
    <div class="__select-value">{{ value }}</div>
    <teleport to="body">
      <div class="__select-wrap" :style="{
        minWidth: position.width + 'px',
        top: position.top + 'px',
        left: position.left + 'px'
      }" v-show="showOption">
        <slot></slot>
      </div>
    </teleport>
  </div>
</template>

<script>

export default {
  name: "MySelect",
  props: ['value', 'len'],
  data() {
    return {
      showOption: false,
      position: {
        pos: 'bottom',
        top: 0,
        left: 0,
        width: 280
      },
      cpTimeout: null
    }
  },
  mounted() {
    this.cpTimeout = setTimeout(() => {
      this.computePos()
    }, 501)
  },
  beforeUnmount() {
    if (this.cpTimeout) {
      clearTimeout(this.cpTimeout);
    }
  },
  watch: {
    len() {
      this.computePos()
    }
  },
  methods: {
    show() {
      this.showOption = !this.showOption
    },
    hide() {
      this.showOption = false;
    },
    getElementTop(element) {
      let actualTop = element.offsetTop;
      let current = element.offsetParent;
      while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }
      return actualTop;
    },
    getElementLeft(e) {
      let left = e.offsetLeft;
      let current = e.offsetParent;
      while (current !== null) {
        left += current.offsetLeft;
        current = current.offsetParent;
      }
      return left;
    },
    computePos() {
      let elHeight = this.$refs.select.offsetHeight;
      let absPos = this.getElementTop(this.$refs.select);
      let contentHeight = this.len * 80;
      let left = this.getElementLeft(this.$refs.select);
      this.position.width = this.$refs.select.offsetWidth
      let docHeight = document.documentElement.clientHeight
          || document.body.clientHeight || 0;
      if ((elHeight + absPos + contentHeight + 6) > docHeight) {
        this.position.pos = 'top';
        this.position.top = absPos - Math.min(contentHeight, 320) - 6
      } else {
        this.position.pos = 'bottom';
        this.position.top = elHeight + absPos + 6
      }
      this.position.left = left
    }
  }
}
</script>

