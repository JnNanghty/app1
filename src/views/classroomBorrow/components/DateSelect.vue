<style lang="stylus" scoped>
.ds-top
  get_background(borrow_wrap_background)
  border-radius 8px;
  display flex
  justify-content center
  padding: .5rem 2rem;
  box-sizing border-box

  .icon
    padding: 1rem
    get_background(input_background)
    border-radius 8px;
    display flex
    align-items center
    justify-content center

    img
      width: .8rem
      height @width

  .time
    flex: 1;
    display flex
    align-items center
    justify-content center
    font-size 1rem;
    font-weight 500

.ds-content
  overflow-y scroll
  margin-top: 5px
  padding: 1rem;
  box-sizing border-box
  .time-item
    display flex
    justify-content space-between
    padding: 13px
    &:nth-child(2n)
      get_background(borrow_date_item_background)
    .status1
      width: 5rem
      margin: 0
    .status2
      color #59B565
      border 2px solid @color
      border-radius 8px
      height: 2rem
      line-height @height
      text-align center
</style>
<template>
  <div class="ds-main">
    <div class="ds-top">
      <div class="icon " @click="changeDate('pre')"><img src="../../../assets/left_arrow.png" alt=""></div>
      <div class="time">{{ currentTime }}</div>
      <div class="icon " @click="changeDate('next')"><img src="../../../assets/right_arrow.png" alt=""></div>
    </div>
    <div class="ds-content">
      <div class="time-item" v-for="(item, index) in timeConfig" :key="item.id">
        <div>第{{ index + 1 }}节 <span>{{ item.start }}</span> <span>-</span> <span>{{ item.end }}</span></div>
        <template v-if="item.status === 1">
          <div class="status1 _button">预约</div>
        </template>
        <template v-else-if="item.status === 2">
          <div class="status2"><i><img src="../../../assets/success.png" alt=""></i>已预约</div>
        </template>
        <template v-else>
          <div class="status3">不可预约</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import timeUtil from "@/util/timeUtil";
import service from "@/api/services";
import mitt from "@/util/mitt";
import ls from "@/store/ls";

export default {
  name: "DateSelect",
  data() {
    return {
      date: Date.now(),
      timeConfig: [],
      terminalId: null,
      sectionConfig: {
        morning: 5,
        afternoon: 5,
        evening: 3,
        courseSection: []
      }
    }
  },
  computed: {
    currentTime() {
      return timeUtil.formatDate(this.date, '-') + '  (' + timeUtil.getCurrentDay(this.date) + ')';
    }
  },
  created() {
    this.terminalId = ls.get('terminalId')
    this.getSectionConfig() // 查上午下午晚上有几节
    // this.getTimeConfig() // 查可借用的时间配置
  },
  mounted() {
  },
  methods: {
    changeDate(name) {
      if (name === 'pre') {
        this.date -= 24 * 60 * 60 * 1000
      } else {
        this.date += 24 * 60 * 60 * 1000
      }
      mitt.emit('changeDate', this.date)
    },
    // getTimeConfig() {
    //   service.post('model/getEntities', {
    //     target: 'terminalBorrowConfig',
    //     retFields: ['start', 'end']
    //   }).then(res => {
    //     let config = res.list[0];
    //     let start = JSON.parse(config.start)
    //     console.log(start)
    //     let end = JSON.parse(config.end)
    //     let len = start.length;
    //     let temp = []
    //     // status 当前时间的借用状态  1 可以预约  2已经预约  3不可预约
    //     for (let i = 0; i < len; i++) {
    //       temp.push({
    //         start: start[i],
    //         end: end[i],
    //         status: 1,
    //         id: i
    //       })
    //     }
    //     this.timeConfig = temp;
    //   })
    // },
    getSectionConfig() {
      service.post('course/terminalSection', {
        id: this.terminalId
      }).then(res => {
        this.sectionConfig = res;
        let temp = []
        res.courseSection.forEach((item, index) => {
          let time = item.split('-')
          let start = time[0]
          let end = time[1]
          temp.push({
            start,
            end,
            status: 1,
            id: index + 1
          })
        })
        this.timeConfig = temp;
      })
    }
  }
}
</script>

