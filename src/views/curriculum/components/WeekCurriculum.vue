<style scoped lang="stylus">
.week-curriculum-main
  overflow-y: scroll;
  height: 100%;
  padding-right: 30px
  box-sizing border-box
  get_font_color(font_color)

  .change-week
    overflow-x scroll
    margin-bottom: 1rem;

    &::-webkit-scrollbar
      height: 0

    .scroll-wrap
      itemWidth = 11rem;
      width 19 * itemWidth

      .week-item
        float left
        width itemWidth
        box-sizing border-box
        padding: 10px 25px 0;
        height: 2.9rem
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

.table-col
  flex: 1;

  .table-row
    min-height: 2.5rem;
    box-sizing: border-box;
    display flex
    justify-content center
    align-items center
    position relative
    font-size .45rem;

  .course-item
    get_background(patrol_bottom_background)
    border-radius 4px;
    margin-left: .25rem
    margin-right: .25rem
    margin-bottom: .5rem
    border-right: none;
    position relative

    .course-detail
      position absolute
      top: 53%
      left: 50%;
      transform: translateX(-50%);
      border-radius 8px;
      width: 200px
      get_background(curriculum_course_detail_background)
      box-shadow: 0 8px 10px rgba(43, 51, 69, 0.208523);
      z-index 10
      text-align left
      padding: 5px 20px;
      font-size .6rem

      &::after
        position absolute
        top: -10px;
        left: 50%
        content ''
        display block
        width: 0
        height: 0
        border: 5px solid #000;
        border-top-color: transparent;
        border-bottom-color: #575D67;
        border-left-color: transparent;
        border-right-color: transparent;

  .table-title
    get_background(curriculum_section_background)
    padding: 8px 0;
    margin-bottom: 2px
    font-size .7rem
    min-height: auto;
    border-right: none

  &:nth-child(1) .table-title
    border-top-left-radius 8px;

  &:nth-child(8) .table-title
    border-top-right-radius 8px;

  .section-row
    padding: 3px
    get_background(curriculum_section_background)
    color #9fa2a7
    display block

    .section-label
      font-size .8rem

    .section-time
      font-size .6rem
      transform scale(0.8)

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
      <div class="table-col">
        <div class="table-row table-title">课节时间</div>
        <div class="table-row section-row" v-for="(item, index) in sectionTime" :key="index">
          <span class="section-label">第{{ simplifyNum[index] }}节</span>
          <div class="section-time">{{ item }}</div>
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
            <div>{{ course.teacherName }} <span
                style="margin-left: 1rem;">{{ calcTime(course.startSession, course.endSession) }}</span></div>
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
      firstWeek: null
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
      let data = {
        "firstWeek": "2022-02-06T16:00:00.000Z",
        "sessionSourceList": [
          {
            "startSource": 480,
            "endSource": 520
          },
          {
            "startSource": 530,
            "endSource": 570
          },
          {
            "startSource": 580,
            "endSource": 620
          },
          {
            "startSource": 630,
            "endSource": 665
          },
          {
            "startSource": 670,
            "endSource": 770
          },
          {
            "startSource": 780,
            "endSource": 820
          },
          {
            "startSource": 830,
            "endSource": 870
          },
          {
            "startSource": 880,
            "endSource": 960
          },
          {
            "startSource": 970,
            "endSource": 1010
          },
          {
            "startSource": 1020,
            "endSource": 1070
          },
          {
            "startSource": 1080,
            "endSource": 1120
          },
          {
            "startSource": 1120,
            "endSource": 1190
          },
          {
            "startSource": 1205,
            "endSource": 1245
          }
        ]
      }
      this.currentWeek = this.calcCurrentWeek(data.firstWeek);
      this.firstWeek = data.firstWeek;
      this.scrollLeft()
      this.sectionTime = data.sessionSourceList.map(i => {
        return `${timeUtil.sourceToTime(i.startSource)}-${timeUtil.sourceToTime(i.endSource)}`;
      })
      this.getCurriculum();

    },
    getCurriculum() {
      let res = [
        [
          {
            "college": null,
            "courseName": "大学英语（2）",
            "dayOfWeek": 1,
            "courseClass": "信息1班",
            "teacherName": "谢佳文",
            "endSession": 2,
            "courseNumber": "10001",
            "startSession": 1
          },
          {
            "college": "士官学院（人武部）",
            "courseName": "GIS实务Ⅱ",
            "dayOfWeek": 1,
            "courseClass": "士官测绘19-1",
            "teacherName": "熊国华",
            "endSession": 3,
            "courseNumber": "(2020-2021-2)-23711062-170139-1",
            "startSession": 3
          }
        ],
        [
          {
            "college": "工程造价学院",
            "courseName": "建筑CAD",
            "dayOfWeek": 2,
            "courseClass": "造价20-4",
            "teacherName": "刘松鑫",
            "endSession": 7,
            "courseNumber": "(2020-2021-2)-22019020-000102-2",
            "startSession": 6
          }
        ],
        [
          {
            "college": null,
            "courseName": "大学英语（1）",
            "dayOfWeek": 3,
            "courseClass": "高数4班",
            "teacherName": "谢佳文",
            "endSession": 2,
            "courseNumber": "20001",
            "startSession": 1
          },
          {
            "college": "士官学院（人武部）",
            "courseName": "遥感测绘技术",
            "dayOfWeek": 3,
            "courseClass": "士官测绘19-2",
            "teacherName": "王东东",
            "endSession": 3,
            "courseNumber": "(2020-2021-2)-23708030-000168-2",
            "startSession": 3
          }
        ],
        [
          {
            "college": "工程造价学院",
            "courseName": "BIM图形算量实务",
            "dayOfWeek": 4,
            "courseClass": "造价19-6",
            "teacherName": "俞嘉陈",
            "endSession": 2,
            "courseNumber": "(2020-2021-2)-22533020-000103-1",
            "startSession": 1
          },
          {
            "college": "工程造价学院",
            "courseName": "BIM基础与实务",
            "dayOfWeek": 4,
            "courseClass": "造价20-7",
            "teacherName": "李修强(经管)",
            "endSession": 5,
            "courseNumber": "(2020-2021-2)-22005020-000116-1",
            "startSession": 4
          },
          {
            "college": "工程造价学院",
            "courseName": "房地产经营管理",
            "dayOfWeek": 4,
            "courseClass": "房地产19-1",
            "teacherName": "应佐萍",
            "endSession": 7,
            "courseNumber": "(2020-2021-2)-22026040-160125-1",
            "startSession": 6
          }
        ],
        [
          {
            "college": "士官学院（人武部）",
            "courseName": "遥感测绘技术",
            "dayOfWeek": 5,
            "courseClass": "士官测绘19-1",
            "teacherName": "王东东",
            "endSession": 12,
            "courseNumber": "(2020-2021-2)-23708030-000168-1",
            "startSession": 1
          },
          {
            "college": "建筑工程学院",
            "courseName": "建筑CAD",
            "dayOfWeek": 5,
            "courseClass": "建工20-3",
            "teacherName": "闫明",
            "endSession": 8,
            "courseNumber": "(2020-2021-2)-31031040-160131-1",
            "startSession": 7
          }
        ],
        [
          {
            "college": "工程造价学院",
            "courseName": "建设工程投资控制与合同管理",
            "dayOfWeek": 6,
            "courseClass": "监理19-2",
            "teacherName": "余春春",
            "endSession": 12,
            "courseNumber": "(2020-2021-2)-21205040-150172-1",
            "startSession": 1
          }
        ],
        []
      ]
      // android webview 57 / chrome 57版本才实现 display:grid 所以以下代码需要改
      const sectionLen = this.sectionTime.length;
      let data = [];
      res.forEach((item, index) => {
        let temp = [];
        for (let i = 1; i <= sectionLen; i++) {
          let hasPush = false;
          item.forEach(course => {
            if (i >= course.startSession && i <= course.endSession) {
              temp.push(Object.assign(course, {
                style: {
                  height: (2.5 * (course.endSession - course.startSession + 1) - 0.5) + 'rem'
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
              height: '2.5rem'
            },
            showDetail: false
          });
        }
        data.push(temp);
      });
      this.curriculum = data;
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
      this.$refs.weekWrap.scrollBy({
        left: (this.currentWeek - 1) * window.rem * 11,
        behavior: "smooth"
      })
    },
    // 根据开始节次和结束节次 计算开始时间和结束时间
    calcTime(startSession, endSession) {
      let start = this.sectionTime[startSession - 1]
      let end = this.sectionTime[endSession - 1]
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
