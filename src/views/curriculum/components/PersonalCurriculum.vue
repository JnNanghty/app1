<style scoped lang="stylus">
.week-curriculum-main
  height: 100%;
  padding-right: 30px
  box-sizing border-box
  get_font_color(font_color)

  .change-week
    overflow-x scroll
    margin-bottom: .5rem;

    &::-webkit-scrollbar
      height: 0

    .scroll-wrap
      itemWidth = 11rem;
      width 19 * itemWidth

      .week-item
        float left
        width itemWidth
        box-sizing border-box
        height: 2.4rem
        font-size .7rem;
        line-height @height
        text-align center

      .week-item-active
        position relative;
        border-bottom 1px solid #FDA45E;

        &::after {
          content: '';
          position absolute;
          top: 0
          left: 0
          width: 100%
          height: 100%
          background: linear-gradient(180deg, rgba(51, 57, 65, 0.0001) 11.53%, rgba(123, 96, 77, 0.5) 53.32%, #FDA45E 100%);
          opacity: 0.26;
        }

.table
  display flex
  text-align center
  height: 17rem
  overflow-y: scroll;

.table-col
  flex: 1;

  .table-row
    min-height: 1rem;
    box-sizing: border-box;
    display flex
    justify-content center
    align-items center
    position relative
    font-size .51rem;

  .course-item
    get_background(patrol_bottom_background)
    border-radius 4px;
    margin-left: .125rem
    margin-right: .125rem
    margin-bottom: .3rem
    border-right: none;
    position relative
    padding: 0.2rem;
    font-size .45rem;
    box-sizing border-box

    .course-detail
      position absolute
      top: 80%
      left: 50%;
      transform: translateX(-50%);
      border-radius 8px;
      width: 10rem;
      get_background(curriculum_course_detail_background)
      box-shadow: 0 8px 10px rgba(43, 51, 69, 0.208523);
      z-index 10
      text-align left
      padding: .5rem 1rem;
      font-size .6rem

      &::after
        position absolute
        top: -1rem;
        left: 50%
        transform translateX(-50%)
        content ''
        display block
        width: 0
        height: 0
        border: .5rem solid #000;
        border-top-color: transparent;
        border-bottom-color: #575D67;
        border-left-color: transparent;
        border-right-color: transparent;

  .table-title
    get_background(curriculum_section_background)
    padding: .3rem 0;
    margin-bottom: 2px
    font-size .7rem
    min-height: auto;
    border-right: none

  &:nth-child(1) .table-title
    border-top-left-radius 8px;

  &:nth-child(8) .table-title
    border-top-right-radius 8px;

  .section-row
    display flex
    get_background(curriculum_section_background)
    color #9fa2a7
    align-items: stretch;

    .time-line
      writing-mode: tb;
      font-size .6rem;
      letter-spacing .5rem;
      padding: 0 0.5rem
      border-bottom 3px solid #2F333A
      border-right: 3px solid #2F333A
      get_border_color(curriculum_timeline_border_color)
      get_font_color(font_color)
    .section-wrap
      flex: 1

    .section-label
      font-size .4rem

    .section-time
      font-size .3rem

</style>
<template>
  <div class="week-curriculum-main">
    <div class="change-week" ref="weekWrap">
      <div class="scroll-wrap">
        <div class="week-item" :class="currentWeek === item ? 'week-item-active' : ''"
             v-for="item in 19" :ref="'week-item-' + item" @click="changeWeek(item)">
          第{{ simplifyNum[item - 1] }}周 <span style="margin-left: 10px;">{{ getTimeRange(item) }}</span>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="table-col" style="flex: 1.2">
        <div class="table-row table-title">课节时间</div>
        <div class="table-row section-row" v-for="(item, index, c) in sectionTime" :key="index">
          <div class="time-line">{{ index === 'morning' ? '上午' : index === 'afternoon' ? '下午' : '晚上' }}</div>
          <div class="section-wrap">
            <div v-for="(time, i) in item" :key="i" style="min-height: 1rem;box-sizing: border-box;">
              <span class="section-label">第{{ simplifyNum[i] }}节</span>
              <div class="section-time">{{ time }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-col" v-for="(item, index) in curriculum" :key="item">
        <div class="table-row table-title">星期{{ simplifyNumberArray[index] }}</div>
        <div class="table-row" :class="!!course.courseName ? 'course-item' : ''"
             v-for="(course, courseIndex) in curriculum[index]"
             :key="courseIndex" :style="course && course.style" @click="selectItem(course)">
          {{ course && course.courseName }}
          <div class="course-detail" v-if="course.courseName && course.showDetail">
            <div style="font-size: .9rem;">{{ course.courseName }}</div>
            <div>{{ course.teacherName }} <span style="margin-left: 1rem;">{{ calcTime(course.startSession, course.endSession) }}</span></div>
            <div style="margin-bottom: 10px;">{{ course.college }}</div>
            <div>{{ course.courseClass }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ls from "@/store/ls";
import {msg} from "@/components/message";
import service from "@/api/services";
import timeUtil from "@/util/timeUtil";

export default {
  data() {
    return {
      terminalId: null,
      currentWeek: 1,
      sectionTime: [],
      curriculum: [],
      simplifyNumberArray: ['一', '二', '三', '四', '五', '六', '日'],
      simplifyNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九'],
      closeTimeout: null,
      firstWeek: null,
      terminalSectionTime: []
    }
  },
  mounted() {
    this.terminalId = ls.get('terminalId');
    if (this.terminalId) {
      this.getFirstWeek();
    } else {
      msg({
        message: '请先在设置中绑定班级！'
      });
    }
  },
  beforeUnmount() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout)
      this.closeTimeout = null;
    }
  },
  methods: {
    getFirstWeek() {
      service.post('classCard/scheduleInfo', {
        id: this.terminalId
      }).then(res => {
        service.post('course/terminalSection', {
          id: this.terminalId
        }).then(sec => {
          let temp = {
            morning: [],
            afternoon: [],
            evening: []
          }
          this.terminalSectionTime = sec.courseSection
          sec.courseSection.forEach((item, index) => {
            // 1 可预约  2 已被预约 3不可预约
            if (index < sec.morning) {
              temp.morning.push(item)
            } else if (index >= sec.morning && index < sec.morning + sec.afternoon) {
              temp.afternoon.push(item)
            } else {
              temp.evening.push(item)
            }
          })
          this.currentWeek = this.calcCurrentWeek(res.data.firstWeek);
          this.firstWeek = res.data.firstWeek;
          this.scrollLeft()
          this.sectionTime = temp;
          this.getCurriculum();
        })
      })
    },
    getCurriculum() {
      // android webview 57 / chrome 57版本才实现 display:grid 所以以下代码需要改
      service.post('course/personalCurriculum', {
        id: this.terminalId,
        weekNo: this.currentWeek
      }).then(res => {
        // 空格子
        const sectionLen = this.sectionTime.morning.length + this.sectionTime.afternoon.length + this.sectionTime.evening.length;
        let data = [];
        res.result.forEach((item, index) => {
          let temp = [];
          for (let i = 1; i <= sectionLen; i++) {
            let hasPush = false;
            item.forEach(course => {
              if (i >= course.startSession && i <= course.endSession) {
                temp.push(Object.assign(course, {
                  style: {
                    height: (1.15 * (course.endSession - course.startSession + 1) - 0.3) + 'rem'
                  },
                  showDetail: false
                }));
                i = course.endSession;
                hasPush = true;
              }
            });
            !hasPush && temp.push({
              courseName: '',
              courseNumber: '',
              dayOfWeek: index + 1,
              startSession: i,
              endSession: i,
              style: {
                height: '1.15rem'
              },
              showDetail: false
            });
          }
          data.push(temp);
        });
        this.curriculum = data;
      });
    },
    calcCurrentWeek(firstWeek) {
      const fwt = new Date(firstWeek).getTime();
      const now = new Date().getTime();
      let weekNum = Math.floor((now - fwt) / 1000 / 60 / 60 / 24 / 7) + 1;
      if (isNaN(weekNum) || weekNum < 1) {
        weekNum = 1;
      }
      return weekNum;
    },
    changeWeek(week) {
      this.currentWeek = week;
      this.getCurriculum();
    },
    selectItem(item) {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout)
        this.closeTimeout = null;
      }
      this.closeOther()
      item.showDetail = true;
      this.closeTimeout = setTimeout(() => {
        this.closeOther();
        this.closeTimeout = null
      }, 5e3)
    },
    scrollLeft() {
      // this.$refs.weekWrap.scrollBy({
      //   left: (this.currentWeek - 1) * window.rem * 11,
      //   behavior: "smooth"
      // })
      this.$refs.weekWrap.scrollLeft = (this.currentWeek - 1) * window.rem * 11
    },
    // 根据开始节次和结束节次 计算开始时间和结束时间
    calcTime(startSession, endSession) {
      let start = this.terminalSectionTime[startSession - 1]
      let end = this.terminalSectionTime[endSession - 1]
      let startTime = start.split('-')[0]
      let endTime = end.split('-')[1];
      return startTime + '-' + endTime;
    },
    closeOther() {
      this.curriculum.forEach(item => {
        item.forEach(i => i.showDetail = false)
      });
    },
    getTimeRange(index) {
      let d = new Date(this.firstWeek).getTime()
      let start = d + (index - 1) * 7 * 24 * 60 * 60 * 1000;
      let end = start + 7 * 24 * 60 * 60 * 1000
      let sm = new Date(start).getMonth() + 1;
      let em = new Date(end).getMonth() + 1;
      let sd = new Date(start).getDate();
      let ed = new Date(end).getDate();
      if (sm < 10) sm = '0' + sm;
      if (sd < 10) sd = '0' + sd;
      if (em < 10) em = '0' + em;
      if (ed < 10) ed = '0' + ed;
      return sm + '/' + sd + ' - ' + em + '/' + ed
    }
  }
}
</script>
