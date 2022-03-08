<style lang="stylus" scoped>
@import "~@/theme/mixin.styl";


.c-main-content
  position relative
  get_font_color(font_color);

  .c-clock-canvas
    margin: 0 auto

  .c-clock
    border-radius 50%;
    border 10px solid
    get_border_color(clock_border_color)
    width: 16rem
    height @width
    position relative
    get_background(clock_background)

    .c-minutes
      width: 2px;
      height: 8rem
      position absolute
      top: 0
      left: 50%;
      get_background(clock_minute_background)
      transform-origin bottom

      &::after
        content: ''
        display block
        position absolute
        width 4px;
        height 7.3rem;
        get_background(clock_minute_after_background)
        left -1px;
        bottom 0

    for item in 1..12
      .c-minutes-{item}
        transform rotate(30deg * item)

    .c-minute-num
      get_font_color(font_color)
      position absolute
      font-size 12px;
    .c-minute-num-1
      top: -1.5rem;
      left: 8rem;
      transform translateX(-50%)
    .c-minute-num-2
      top: 8rem;
      left: 17rem;
      transform translateY(-50%)
    .c-minute-num-3
      top: 17rem;
      left: 8rem;
      transform translateX(-50%)
    .c-minute-num-4
      top: 8rem;
      left: -1.5rem;
      transform translateY(-50%)

  .c-course-info
    position absolute;
    top: 0
    left: 0
    width: 17rem;
    text-align: center;

    .c-nocourse
      margin-top: 163px
      font-size 32px
      color #59B565;


</style>
<template>
  <div class="c-main-content">
    <!--    <canvas class="c-clock-canvas" ref="clockCanvas" width="320" height="320"></canvas>-->
    <div class="c-clock">
      <div class="c-minutes c-minutes-1"></div>
      <div class="c-minutes c-minutes-2"></div>
      <div class="c-minutes c-minutes-3"></div>
      <div class="c-minutes c-minutes-4"></div>
      <div class="c-minutes c-minutes-5"></div>
      <div class="c-minutes c-minutes-6"></div>
      <div class="c-minutes c-minutes-7"></div>
      <div class="c-minutes c-minutes-8"></div>
      <div class="c-minutes c-minutes-9"></div>
      <div class="c-minutes c-minutes-10"></div>
      <div class="c-minutes c-minutes-11"></div>
      <div class="c-minutes c-minutes-12"></div>
      <div class="c-minute-num c-minute-num-1">12</div>
      <div class="c-minute-num c-minute-num-2">3</div>
      <div class="c-minute-num c-minute-num-3">6</div>
      <div class="c-minute-num c-minute-num-4">9</div>
    </div>

    <div class="c-course-info">
      <template v-if="!currentCourse">
        <div class="c-nocourse">当前空闲</div>
      </template>
      <template v-else>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "Clock",
  props: [''],
  data() {
    return {
      ctx: null,
      currentCourse: null,
      check: false
    }
  },
  created() {
  },
  mounted() {
    // this.ctx = this.$refs.clockCanvas.getContext('2d');
    // this.init();
  },
  computed: {},
  watch: {
    currentCourse() {
      this.init();
    }
  },
  methods: {
    init() {
      this.loadImageAndDraw(require('@/assets/clock.png'), 0, 0, 320, 320)

      if (this.currentCourse) {

      } else {
        this.loadImageAndDraw(require('@/assets/icon/clock_eye.png'), 137, 100, 46, 40)
      }
    },
    loadImageAndDraw(src, dx, dy, width, height) {
      let img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, dx, dy, width, height)
      }
      img.src = src;
    }
  }
}
</script>