<style lang="stylus" scoped>
.ds-top
  get_background(borrow_wrap_background)
  border-radius .4rem
  display flex
  justify-content center
  padding: .5rem 2rem;
  box-sizing border-box

  .icon
    width: 2rem
    height: 2.4rem
    get_background(input_background)
    border-radius .4rem
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
  margin-top: 10px
  padding: 1rem 1rem 1rem 3rem;
  box-sizing border-box
  height: 16rem
  position relative

  .time-item
    display flex
    justify-content space-between
    padding: .35rem
    line-height 2rem;
    font-size .6rem;


    &:nth-child(2n)
      get_background(borrow_date_item_background)

    .status1
      width: 5rem
      margin: 0

    .status2
      width: 5rem
      color #59B565
      border 2px solid @color
      border-radius 8px
      height: 2rem
      line-height @height
      text-align center
      box-sizing border-box

      .icon
        margin-right: .5rem;
        vertical-align middle

        img
          width: .8rem
          height: @width

    .status3
      width: 5rem;
      height: 2rem
      line-height @height
      text-align center
      border-radius 8px
      get_background(input_background)

  .time-line-item
    padding-top: 2rem
    position relative
    margin-bottom: 1rem

    &::after
      content: ''
      display block
      position absolute
      top: 1rem;
      left: -1.55rem;
      width: 2px
      height: 100%
      background: #424851

    .time-line
      position absolute
      top: 0
      font-size .8rem;
      font-weight 600

      &::after
        content: ''
        position absolute
        top: 50%;
        left: -2.1rem
        display block
        border-radius 50%
        border .2rem solid #979797
        width: .7rem
        height: @width
        transform: translateY(-0.65rem);

</style>
<template>
  <div class="ds-main">
    <div class="ds-top">
      <div class="icon " @click="changeDate('pre')"><img src="../../../assets/left_arrow.png" alt=""></div>
      <div class="time">{{ currentTime }}</div>
      <div class="icon " @click="changeDate('next')"><img src="../../../assets/right_arrow.png" alt=""></div>
    </div>
    <div class="ds-content">
      <div class="time-line-item" v-for="(timeItem, index1) in timeConfig" :key="index1">
        <div class="time-line">{{ index1 === 'morning' ? '上午' : index1 === 'afternoon' ? '下午' : '晚上' }}</div>
        <div class="time-item" v-for="(item, index) in timeItem" :key="index">
          <div><span style="font-size: .8rem;">第{{ index + 1 }}节</span><span style="margin-left: 1.5rem">{{ item.start }}</span> <span style="font-size:.3rem;vertical-align:middle;margin: 0 0.6rem">-</span> <span>{{ item.end }}</span></div>
          <template v-if="item.status === 1">
            <div class="status1 _button" @click="borrow(item)">预约</div>
          </template>
          <template v-else-if="item.status === 2">
            <div class="status2"><i class="icon"><img src="../../../assets/success_2.png" alt=""></i>已预约</div>
          </template>
          <template v-else>
            <div class="status3">不可预约</div>
          </template>
        </div>
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
      timeConfig: {},
      terminalId: null,
      sectionConfig: {
        morning: 5,
        afternoon: 5,
        evening: 3,
        courseSection: []
      }
    }
  },
  inject: ['cantBorrowTime'],
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
    console.log(this.cantBorrowTime)
  },
  watch: {
    cantBorrowTime() {
      this.reset()
    }
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
    getSectionConfig() {
      service.post('course/terminalSection', {
        id: this.terminalId
      }).then(res => {
        this.sectionConfig = res;
        let temp = {
          morning: [],
          afternoon: [],
          evening: []
        }
        res.courseSection.forEach((item, index) => {
          let time = item.split('-')
          let start = time[0]
          let end = time[1]
          let startSource = this.calcSource(start)
          let endSource = this.calcSource(end)
          let duration = endSource - startSource;
          let can = this.cantBorrowTime.every(item2 => {
            let itemDuration = item2.endSource - item2.startSource;
            let max = Math.max(item2.endSource, endSource);
            let min = Math.min(item2.startSource, startSource)
            let cha = max - min;
            return cha >= (itemDuration + duration);
          });
          // 1 可预约  2 已被预约 3不可预约
          let timeItem = {
            start,
            end,
            status: can ? 1 : 3,
            id: index + 1
          }
          if (index < res.morning) {
            temp.morning.push(timeItem)
          } else if (index >= res.morning && index < res.morning + res.afternoon) {
            temp.afternoon.push(timeItem)
          } else {
            temp.evening.push(timeItem)
          }
        })
        this.timeConfig = temp;
      })
    },
    borrow(item) {
      // 添加预约时间
      item.status = 2;
      mitt.emit('addBorrowTime', item)
    },
    calcSource(time) {
      const h = +time.split(':')[0]
      const m = +time.split(':')[1]
      return h * 60 + m;
    },
    reset() {
      for(let key in this.timeConfig) {
        this.timeConfig[key].forEach(item => {
          let startSource = this.calcSource(item.start)
          let endSource = this.calcSource(item.end)
          let duration = endSource - startSource;
          let can = this.cantBorrowTime.every(item2 => {
            let itemDuration = item2.endSource - item2.startSource;
            let max = Math.max(item2.endSource, endSource);
            let min = Math.min(item2.startSource, startSource)
            let cha = max - min;
            return cha >= (itemDuration + duration);
          });
          item.status = can ? 1 : 3
        })
      }
    }
  }
}
</script>

