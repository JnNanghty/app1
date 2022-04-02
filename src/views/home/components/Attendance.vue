<style lang="stylus" scoped>
.a-main
  get_font_color(font_color)
  padding-right: 2rem
  box-sizing border-box
  display flex
  flex-direction column
  justify-content: center;
  height: 100%

.a-top
  get_background(patrol_course_info_background)
  border-radius .6rem;
  display flex
  position relative
  padding: 1rem .7rem
  box-sizing border-box
  justify-content space-around

  .top-item
    text-align center
    flex: 1;

    p
      opacity .6
      font-size .7rem;

    .number
      font-size 1.6rem;
      font-weight 900

  .line
    position relative

    &::after
      content: ''
      position absolute
      top: 0
      right: 0
      width: 1px
      height: 100%
      background: #272727;
      mix-blend-mode: normal;
      opacity: 0.47;

  .drag-button
    position absolute
    left: 0
    right: 0
    bottom: -0.5rem
    margin: 0 auto;
    width: 1.5rem

    img
      width: 100%

.student-info
  overflow-x hidden
  overflow-y: scroll;
  display flex
  flex-wrap wrap
  padding: 10px
  box-sizing border-box
  width: 100%
  z-index 5
  position relative
  top -0.4rem;
  get_background(student_info_background)
  border-bottom-left-radius .6rem
  border-bottom-right-radius .6rem
  flex 1;

  .student-item
    border-radius 50%
    width: 1.6rem
    height @width
    text-align center
    line-height @height
    get_background(student_item_background)
    margin: .8rem

  .student-active
    background: #FDA45E !important

.a-bottom
  get_background(patrol_course_info_background)
  display flex
  justify-content space-around
  border-radius 8px;
  padding: 2rem 1rem;
  box-sizing border-box
  margin-top: .5rem

  .auth-item
    width: 20%
    position relative
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    img
      width: 100%

.desc
  text-align center
  font-size 0.8rem;
  white-space nowrap

.a-bottom-mini
  display flex
  justify-content space-around
  height: 2.3rem
  margin-top: .5rem

  img
    width: 2rem
    vertical-align middle
    margin-right: 1rem

.in-course
  display flex
  flex-wrap wrap
  text-align center
  align-items center
  padding: .8rem 1.5rem;
  box-sizing border-box
  get_background(next_course_info_background)
  margin-bottom: 0.8rem;
  border-radius .4rem;

  .next-course
    color #FDA45E
    margin-right: 1.5rem
    font-size .8rem;

  .next-course-info
    text-align left
    flex 1;
    font-size 1rem;

  .next-course-info-item
    width: 100%
    font-size 1.5rem;
    margin-top: 10px
</style>
<template>
  <div class="a-main">
    <div class="in-course" v-if="currentCourseFlag">
      <template v-if="show">
        <div class="next-course">下一节课</div>
        <div class="next-course-info">
          <div>{{ nextCourse.startTime }} - {{ nextCourse.endTime }}</div>
          <div>{{ nextCourse.courseName }}/{{ nextCourse.teacherName }}</div>
        </div>
      </template>
      <template v-else>
        <div class="next-course" style="width: 100%">下一节课</div>
        <div class="next-course-info-item">{{ nextCourse.startTime }} - {{ nextCourse.endTime }}</div>
        <div class="next-course-info-item">{{ nextCourse.courseName }}/{{ nextCourse.teacherName }}</div>
      </template>
    </div>
    <div class="a-top">
      <div class="top-item line">
        <p>应到人数</p>
        <div class="number">{{ attendanceInfo.students.length }}</div>
      </div>
      <div class="top-item line">
        <p>实到人数</p>
        <div class="number" style="color: #F3A568;">{{ arrived.length }}</div>
      </div>
      <div class="top-item" :class="currentCourseFlag ? 'line' : ''">
        <p>未到人数</p>
        <div class="number" style="color:#989898;">{{ notArrived.length }}</div>
      </div>
      <div class="top-item" v-if="currentCourseFlag">
        <p>迟到人数</p>
        <div class="number">{{ laterArrived.length }}</div>
      </div>
      <div class="drag-button" @click="showDetail"><img src="../../../assets/drag-down.png" alt=""></div>

    </div>
    <div v-if="show" class="student-info">
      <div class="student-item" v-for="item in attendanceInfo.students" :key="item.id"
           :class="item.signInStatus !== 1 ? 'student-active' : ''">{{ item.label }}
      </div>
    </div>
    <template v-if="currentCourseFlag || show">
      <div class="a-bottom-mini" @click="goSignPage">
        <div class="auth-item">
          <img src="../../../assets/brush.png" alt="">
          <span class="desc">一卡通刷卡</span>
        </div>
        <div class="auth-item" v-show="showQrCode">
          <img src="../../../assets/wx_code.png" alt="">
          <span class="desc">微信扫码</span>
        </div>
        <div class="auth-item" v-show="showFace">
          <img src="../../../assets/face.png" alt="">
          <span class="desc">人脸识别</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="a-bottom" @click="goSignPage">
        <div class="auth-item">
          <img src="../../../assets/brush.png" alt="">
          <div class="desc">一卡通刷卡</div>
        </div>
        <div class="auth-item" v-show="showQrCode">
          <img src="../../../assets/wx_code.png" alt="">
          <div class="desc">微信扫码</div>
        </div>
        <div class="auth-item" v-show="showFace">
          <img src="../../../assets/face.png" alt="">
          <div class="desc">人脸识别</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import service from "@/api/services";
import mitt from "@/util/mitt";
import {msg} from "@/components/message";
import ls from "@/store/ls";
import timeUtil from "@/util/timeUtil";

export default {
  name: "Attendance",
  props: {
    nextCourse: {
      type: Object,
      default: {}
    },
    currentCourse: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      attendanceInfo: {
        students: []
      },
      show: false,
      config: []
    }
  },
  computed: {
    currentCourseFlag() {
      return !!this.currentCourse.courseId;
    },
    arrived() {
      return this.attendanceInfo.students.filter(i => i.signInStatus === 3);
    },
    notArrived() {
      return this.attendanceInfo.students.filter(i => i.signInStatus === 1)
    },
    laterArrived() {
      return this.attendanceInfo.students.filter(i => i.signInStatus === 2);
    },
    showQrCode() {
      let show = false;
      this.config.forEach(item => {
        if (item.name === 'code') {
          show = item.value
        }
      });
      return show;
    },
    showFace() {
      let show = false;
      this.config.forEach(item => {
        if (item.name === 'face') {
          show = item.value
        }
      });
      return show;
    }
  },
  created() {
    mitt.on('brushCard', this.brushCard);
    mitt.on('startSignIn', this.startSignIn)
    this.attendanceInfo = ls.get('attendanceInfo') || {students: []}
    let config = ls.get('deviceConfig');
    this.config = config.signInTypes ? JSON.parse(config.signInTypes) : []
  },
  beforeUnmount() {
    mitt.off('brushCard', this.brushCard);
    mitt.off('startSignIn', this.startSignIn)
  },
  methods: {
    startSignIn() {
      const terminalId = ls.get('terminalId')
      service.post('classCard/startSignIn', {
        courseId: this.nextCourse.courseId,
        endSource: this.nextCourse.endSource,
        startSource: this.nextCourse.startSource,
        terminalId: terminalId
      }).then(res => {
        this.attendanceInfo = res.data;
        this.attendanceInfo.students.forEach(item => {
          // 1正常  2迟到   3签到
          if (item.signInStatus === 1) {
            this.notArrived.push(item);
          } else if (item.signInStatus === 2) {
            this.laterArrived.push(item);
          } else {
            item.signInStatus = 1;
          }
        })
        const {second, currentSource} = timeUtil.getNowTime();
        let exp = (this.nextCourse.endSource - currentSource) * 60 * 1000 - second * 1000
        ls.set('attendanceInfo', this.attendanceInfo, exp);
        msg({
          message: '开始签到!'
        });
      })
    },
    brushCard(ic) {
      service.post('classCard/signIn', {
        ic,
        lessonId: this.attendanceInfo.id
      }).then(res => {
        let status = 3;
        if (this.currentCourseFlag) {
          status = 2;
        }
        this.attendanceInfo.students.forEach(item => (item.label === res.data.label) && (item.signInStatus = status));
        msg({
          message: res.data.label + '签到成功',
          type: 'success'
        })
      }, () => {
        msg({
          message: '签到失败',
          type: 'wrong'
        })
      })
    },
    showDetail() {
      // 显示学生
      this.show = !this.show;
    },
    goSignPage() {
      if (this.attendanceInfo.id) {
        this.$router.push({
          name: 'SignAuth'
        })
      } else {
        msg({
          message: '没有签到信息！',
          type: 'wrong'
        })
      }
    }
  }
}
</script>
