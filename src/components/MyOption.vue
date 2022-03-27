<style lang="stylus" scoped>
.__option
  get_background(option_background)
  height: 2rem
  line-height @height
  padding-left 0.6rem
  box-sizing border-box
  get_font_color(font_color)
  font-size 0.8rem
  &:active
    background #FDA45E !important
</style>
<template>
  <div class="__option" @click="selectOption">{{ label }}</div>
</template>

<script>
export default {
  name: "MyOption",
  props: ['label', 'value'],
  emits: ['select'],
  methods: {
    selectOption() {
      this.$emit('select', {label: this.label, value: this.value})
    }
  }
}
</script>


