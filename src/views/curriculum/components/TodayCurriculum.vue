<style scoped lang="stylus">
@import "~@/theme/mixin.styl";
.tab-content {
  overflow-y: scroll;
  height: 100%;
  get_font_color(font_color)
  padding-right: 30px
  box-sizing border-box
}

.table-title {
  display flex
  padding: .55rem 0;
  get_background(curriculum_section_background)
  border-top-left-radius 8px;
  border-top-right-radius 8px;
  margin-bottom: 2px
  justify-content space-around
  font-size .7rem;
  text-align center

  .table-title-item-first {
    width: 5rem
  }

  .table-title-item {
    flex: 1
  }
}

.table-item {
  width: 100%
  display flex

  .time-line {
    text-align center
    writing-mode: tb;
    font-size .6rem;
    letter-spacing .5rem;
    padding: 0 0.5rem
    border-bottom 3px solid #2F333A
    border-right 3px solid #2F333A
    get_border_color(curriculum_timeline_border_color)
    get_font_color(font_color)
    get_background(curriculum_section_background)
  }
}

.list-item {
  display: flex;
  text-align center
  height: 2.35rem

  .section-item {
    padding: .55rem;
    width: 3rem
    box-sizing border-box
    white-space nowrap
    get_background(curriculum_section_background)

    .section-label {
      font-size .6rem
    }

    .section-time {
      font-size .3rem
    }
  }

  .section-item-not-active {
    color #9fa2a7
  }

  .course-item {
    display flex
    flex 1;
    text-align center
    font-weight 200
    font-size .6rem;

    .course-item-desc {
      flex: 1
      display flex
      align-items center
      justify-content center
    }

    .course-class {
      font-size .6rem
    }
  }

  &:nth-child(odd) .course-item {
    get_background(curriculum_section_course_item_odd_background)
  }

  &:nth-child(even) .course-item {
    get_background(curriculum_section_course_item_even_background)
  }

  .course-item-active {
    background: #FDA45E1C !important;
    border-top 1px solid #FDA45E
    color #FDA45E
    box-sizing border-box
  }
}

</style>
<template>
  <div class="tab-content">
    <div class="table-title">
      <div class="table-title-item-first">节次/时间</div>
      <div class="table-title-item">课程名称</div>
      <div class="table-title-item">上课老师</div>
      <div class="table-title-item">上课班级</div>
      <div class="table-title-item">开课学院</div>
    </div>
    <div class="table-content">
      <div class="table-item" v-for="(tItem, idx) in section">
        <div class="time-line">{{ idx === 'morning' ? '上午' : idx === 'afternoon' ? '下午' : '晚上' }}</div>
        <div style="flex: 1;">
          <div v-for="(item, index) in tItem" :key="index" class="list-item">
            <div class="section-item" :class="currentSource > item.endSource ? 'section-item-not-active' : ''">
              <span class="section-label">第{{ simplifyNum[index] }}节</span>
              <div class="section-time">{{ item.startTime }}-{{ item.endTime }}</div>
            </div>
            <div class="course-item"
                 :class="[activeItemStartSource === item.startSource ? 'course-item-active' : '', currentSource > item.endSource ? 'section-item-not-active' : '']">
              <div class="course-item-desc">{{ item.courseName }}</div>
              <div class="course-item-desc">{{ item.teacherName }}</div>
              <div class="course-item-desc course-class">{{ item.courseClass }}</div>
              <div class="course-item-desc">{{ item.college }}</div>
            </div>
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
      list: [],
      section: {},
      terminalId: null,
      simplifyNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四'],
      currentSource: timeUtil.getNowTime().currentSource,
      updateInterval: null,
    }
  },
  created() {
    this.terminalId = ls.get('terminalId');
    if (this.terminalId) {
      this.getDailyCurriculum();
    } else {
      msg({
        message: '请先在设置中绑定班级！'
      });
    }
  },
  mounted() {
    this.updateInterval = setInterval(() => {
      this.currentSource = timeUtil.getNowTime().currentSource;
    }, 1e4);
  },
  beforeUnmount() {
    clearInterval(this.updateInterval);
  },
  computed: {
    activeItemStartSource() {
      const {currentSource} = timeUtil.getNowTime();
      let source = null;
      this.list.forEach((item, i) => {
        if (currentSource >= item.startSource && currentSource <= item.endSource) {
          source = item.startSource;
        }
      });
      return source;
    },
  },
  methods: {
    getDailyCurriculum() {
      service.post('classCard/dailyCurriculum', {
        id: this.terminalId
      }).then(res => {
        this.list = res.data.map(i => {
          i.startTime = timeUtil.sourceToTime(i.startSource)
          i.endTime = timeUtil.sourceToTime(i.endSource)
          return i;
        });
        service.post('course/terminalSection', {
          id: this.terminalId
        }).then(sec => {
          let temp = {
            morning: [],
            afternoon: [],
            evening: []
          }
          let j = 0
          for (let i = 0; i < sec['morning']; i++) {
            temp['morning'].push(this.list[j++]);
          }
          for (let i = 0; i < sec['afternoon']; i++) {
            temp['afternoon'].push(this.list[j++]);
          }
          for (let i = 0; i < sec['evening']; i++) {
            temp['evening'].push(this.list[j++]);
          }

          this.section = temp;
        })
      });
    }
  },
}
</script>

