<style lang="stylus" scoped>

.c-main-content
  position relative
  get_font_color(font_color);

  .c-clock-canvas
    margin: 0 auto


  .c-course-info
    position absolute;
    top: 0
    left: 0
    width: 16rem;
    text-align: center;
    .c-image
      margin-top: 5rem
      img
        width: 2.3rem;
        height: 2rem
    .c-nocourse
      margin-top: 1.15rem
      font-size 1.6rem
      color #59B565;

    .teacher-name
      get_font_color(font_color)
      font-size 1rem

    .course-name
      get_font_color(font_color)
      font-size 1rem

    .title-time
      get_font_color(font_color)
      font-size 1.6rem
      font-weight 900
      margin-bottom: 5px

    .title
      get_font_color(font_color)
      font-size 1rem
      margin-bottom: 5px

    .current-status-active
      color #FDA45E
      font-size .8rem
      margin-top: 4rem
      margin-bottom: 5px

    .current-status
      get_font_color(font_color)
      font-size .8rem
      margin-top: 4rem
      margin-bottom: 5px

    .next-tip
      get_font_color(font_color)
      font-size .8rem

    .next-time
      color #F3A568
      font-size 1.25rem
      font-weight 900


  .point
    position absolute
    top: -.25rem
    left: 7.4rem
    width: 1.2rem
    height: 8.25rem
    transform rotate(90deg)
    transform-origin bottom center

    img
      width: 1.2rem
      height: @width
      transform rotate(105deg)
      transform-origin center center

</style>
<template>
  <div class="c-main-content">
    <canvas class="c-clock-canvas" ref="clockCanvas" :width="canvasSize" :height="canvasSize"></canvas>
    <div class="point" :style="pointStyle">
      <img :src="pointSrc" alt="">
    </div>
    <div class="c-course-info">
      <template v-if="clockStatus === 1">
        <div class="c-image">
          <img src="../../../assets/icon/clock_eye.png" alt="">
        </div>
        <div class="c-nocourse">当前空闲</div>
      </template>
      <template v-else-if="clockStatus === 2">
        <div class="current-status-active">上课中</div>
        <div class="title">{{ currentCourse.college }}</div>
        <div class="teacher-name">{{ currentCourse.teacherName }}</div>
        <div class="course-name">{{ currentCourse.courseName }}</div>
        <div class="next-tip">距离下课还剩</div>
        <div class="next-time">{{ endTime }}</div>
      </template>
      <template v-else-if="clockStatus === 3">
        <div class="current-status">最新的课程</div>
        <div class="title-time">{{ nextCourse.startTime }} - {{ nextCourse.endTime }}</div>
        <div class="teacher-name">{{ nextCourse.teacherName }}</div>
        <div class="course-name">{{ nextCourse.courseName }}</div>
        <div class="next-tip">距离上课还剩</div>
        <div class="next-time">{{ lastTime }}</div>
      </template>
      <template v-else-if="clockStatus === 4">
        <div class="current-status-active">考勤中</div>
        <div class="title-time">{{ nextCourse.startTime }} - {{ nextCourse.endTime }}</div>
        <div class="teacher-name">{{ nextCourse.teacherName }}</div>
        <div class="course-name">{{ nextCourse.courseName }}</div>
        <div class="next-tip">距离上课还剩</div>
        <div class="next-time">{{ lastTime }}</div>
      </template>
    </div>
  </div>
</template>

<script>
import ls from "@/store/ls";
import timeUtil from '@/util/timeUtil'
import mitt from "@/util/mitt";

export default {
  name: "Clock",
  props: ['currentCourse', 'nextCourse', 'inCourse', 'theme'],
  data() {
    return {
      ctx: null,
      canvasSize: window.rem * 16,
      check: false,
      deviceConfig: {
        signInForwardOffset: 5 // 考勤时间 分钟
      },
      pointSrc: require('@/assets/icon/point_dark.svg'),
      clockColor: ['#384050', '#e1581b', '#fba35e'],
      pointStyle: {
        transform: 'rotate(0deg)'
      }
    }
  },
  created() {
    this.deviceConfig = ls.get('deviceConfig');
  },
  mounted() {
    this.ctx = this.$refs.clockCanvas.getContext('2d');
    this.init();
    mitt.on('changeTheme', this.changeTheme);
  },
  beforeUnmount() {
    mitt.off('changeTheme', this.changeTheme)
  },
  computed: {
    clockStatus() {
      // 1、当前无课 下节无课 当前时间在课节时间内
      // 2、当前无课 下节无课 当前时间在空闲时间内
      // 3、当前有课 下节无课 当前时间在课节时间内
      // 4、当前有课 下节无课 当前时间在空闲时间内
      // 5、当前无课 下节有课 当前时间在课节时间内
      // 6、当前无课 下节有课 当前时间在空闲时间内
      // 7、当前有课 下节有课 当前时间在课节时间内
      // 8、当前有课 下节有课 当前时间在空闲时间内

      // 1 2 4都显示空闲
      // 3 7 显示当前课节
      // 5 6 8 显示下节课
      if (!this.ctx) return 1;
      this.clearCanvas();
      const {currentSource} = timeUtil.getNowTime();
      const angle = (currentSource % 720) / 720 * 360;
      this.pointStyle.transform = `rotate(${angle}deg)`;
      if ((!this.currentCourse.courseId && !this.nextCourse.courseId) ||
          (!this.inCourse && !this.nextCourse.courseId)) {
        return 1; // 空闲
      } else if (!!this.currentCourse.courseId && this.inCourse) {
        // 先draw灰色，再draw橙色
        const {startSource, endSource} = this.currentCourse;
        let start = (startSource % 720) / 720;
        let end = (currentSource % 720) / 720;
        this.drawClock(start, end, this.clockColor[0])
        let start1 = (currentSource % 720) / 720;
        let end1 = (endSource % 720) / 720;
        this.drawClock(start1, end1, this.clockColor[2])
        return 2; // 当前正在上课
      } else if ((!this.currentCourse.courseId && !!this.nextCourse.courseId) ||
          (!this.inCourse && !!this.nextCourse.courseId)) {
        // 当前时间 + 考勤时间 < 下节课上课时间  灰色一段 + 深橙色 + 浅橙色
        // 当前时间 + 考勤时间 >= 下节课上课时间  深橙色 + 浅橙色
        const {startSource, endSource} = this.nextCourse;
        const {signInForwardOffset} = this.deviceConfig
        let status = 3;  // 3 为空闲时间内 但下节有课
        if (currentSource + signInForwardOffset < startSource) {
          // 空闲
          let start = (currentSource % 720) / 720;
          let end = ((startSource - signInForwardOffset) % 720) / 720
          this.drawClock(start, end, this.clockColor[0])
        }
        if (currentSource < startSource) {
          let start2 = ((startSource - signInForwardOffset) % 720) / 720;
          let end2 = (startSource % 720) / 720;
          this.drawClock(start2, end2, this.clockColor[1])
        }
        let start3 = (startSource % 720) / 720;
        let end3 = (endSource % 720) / 720;
        this.drawClock(start3, end3, this.clockColor[2]);

        if (currentSource > startSource - signInForwardOffset) {
          // 4 为 课前考勤中
          status = 4;
        }
        mitt.emit('courseStatus', status)
        return status; // 显示即将上课
      }
    },
    lastTime() {
      const {currentSource} = timeUtil.getNowTime();
      let source = this.nextCourse.startSource - currentSource;
      return timeUtil.sourceToTime(source);
    },
    endTime() {
      const {currentSource} = timeUtil.getNowTime();
      let source = this.currentCourse.endSource - currentSource;
      return timeUtil.sourceToTime(source);
    }
  },
  watch: {},
  methods: {
    init() {
      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
      let img = require('@/assets/clock.png');
      this.pointSrc = require('@/assets/icon/point_dark.svg')
      if (window.document.documentElement.dataset.theme === 'bright') {
        img = require('@/assets/clock_bright.png');
        this.pointSrc = require('@/assets/icon_bright/point_bright.png')
      }
      this.loadImageAndDraw(img, this.canvasSize * 0.0625, this.canvasSize * 0.0625, this.canvasSize * 0.875, this.canvasSize * 0.875)

      // if (!this.currentCourse.courseId) {
      //   this.loadImageAndDraw(require('@/assets/icon/clock_eye.png'), 137, 100, 46, 40)
      // }
      this.ctx.save();
    },
    changeTheme() {
      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
      this.init();
    },
    loadImageAndDraw(src, dx, dy, width, height) {
      let img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, dx, dy, width, height);
      }
      img.src = src;
    },
    drawClock(start, end, color) {
      let {ctx} = this
      ctx.strokeStyle = color;
      let sR = this.canvasSize * 0.0208  // 小圆弧的半径
      let bR = this.canvasSize * (0.875 - 0.0625) / 2 // 大圆弧外圈的半径
      let width = this.canvasSize;
      let height = this.canvasSize;
      let bX = width / 2  // 大圆弧的圆心坐标  x
      let bY = height / 2  // 大圆弧的圆心坐标  y
      let pi = Math.PI

      ctx.beginPath()
      ctx.fillStyle = color
      ctx.arc(bX, bY, bR, (pi * 1.5 + pi * 2 * start) % (pi * 2), (pi * 1.5 + pi * 2 * end) % (pi * 2), false);
      ctx.arc(bX, bY, bR - 2 * sR, (pi * 1.5 + pi * 2 * end) % (pi * 2), (pi * 1.5 + pi * 2 * start) % (pi * 2), true)
      ctx.closePath()
      ctx.fill()
    },
    clearCanvas() {
      console.log('restore')
      if (this.ctx) {
        // this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.ctx.restore()

        // this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        // this.init();
      }
    }
  }
}
</script>
