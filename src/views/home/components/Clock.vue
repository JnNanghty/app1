<style lang="stylus" scoped>
.c-main-content {
  position relative

  .c-clock-canvas {
    margin: 0 auto
  }

  .c-course-info {
    position absolute;
    top: 0
    left: 0
    width: 320px;
    text-align: center;

    .c-nocourse {
      margin-top: 163px
      font-size 32px
      color #59B565;
    }
  }
}
</style>
<template>
  <div class="c-main-content">
    <canvas class="c-clock-canvas" ref="clockCanvas" width="320" height="320"></canvas>
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
    this.ctx = this.$refs.clockCanvas.getContext('2d');
    this.init();
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