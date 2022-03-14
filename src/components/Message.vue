<style lang="stylus" scoped>
._message-box
  get_font_color(font_color);
  get_background(message_box_background)
  position absolute
  left: 0
  right: 0
  width fit-content
  margin: 0 auto;
  top: 50%
  transform translateY(-50%)
  border-radius 8px

</style>
<template>
  <teleport to="body">
    <transition>
      <div class="_message-box">
        <img class="_message-icon" :src="iconSrc" alt="">
        <span class="_message-text">{{ message }}</span>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: "Message",
  props: ['message', 'icon'],
  data() {
    return {}
  },
  created() {
  },
  computed: {
    iconSrc() {
      let img = ''
      if (this.icon === 'success') {
        img = require('@/assets/success.png')
      } else if (this.icon === 'wrong') {
        img = require('@/assets/wrong.png')
      }
      return img;
    }
  },
  mounted() {
  },
  methods: {}
}
</script>

