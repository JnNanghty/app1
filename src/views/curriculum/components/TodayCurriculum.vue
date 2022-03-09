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
  padding: 11px 0;
  get_background(curriculum_section_background)
  border-top-left-radius 8px;
  border-top-right-radius 8px;
  margin-bottom: 2px
  justify-content space-around
  font-size 14px;
  text-align center

  .table-title-item-first {
    width: 90px
  }

  .table-title-item {
    flex: 1
  }
}

.list-item {
  color: #ffffff;
  display: flex;
  text-align center


  .section-item {
    padding: 11px
    width: 90px
    box-sizing border-box
    white-space nowrap
    get_background(curriculum_section_background)

    .section-label {
      font-size 16px
    }

    .section-time {
      font-size 12px
      transform scale(0.8)
    }
  }
  .section-item-not-active{
    color #9fa2a7
  }

  .course-item {
    display flex
    flex 1;
    text-align center
    font-weight 200
    .course-item-desc {
      flex: 1
      display flex
      align-items center
      justify-content center
    }
    .course-class{
      font-size 12px
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
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <div class="section-item" :class="currentSource > item.endSource ? 'section-item-not-active' : ''">
          <span class="section-label">第{{ simplifyNum[index] }}节</span>
          <div class="section-time">{{ item.startTime }}-{{ item.endTime }}</div>
        </div>
        <div class="course-item" :class="[activeItemIndex === index ? 'course-item-active' : '', currentSource > item.endSource ? 'section-item-not-active' : '']">
          <div class="course-item-desc">{{ item.courseName }}</div>
          <div class="course-item-desc">{{ item.teacherName }}</div>
          <div class="course-item-desc course-class">{{ item.courseClass }}</div>
          <div class="course-item-desc">{{ item.college }}</div>
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
      terminalId: null,
      simplifyNum: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四'],
      currentSource: timeUtil.getNowTime().currentSource,
      updateInterval: null
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
    activeItemIndex() {
      const {currentSource} = timeUtil.getNowTime();
      let index = null;
      this.list.forEach((item, i) => {
        if(currentSource >= item.startSource && currentSource <= item.endSource){
          index = i;
        }
      });
      return index;
    }
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
      });
    }
  },
}
</script>

