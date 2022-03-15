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
  margin-top: 10px
  padding: 1rem;
  box-sizing border-box
  height: 16rem
  .time-item
    display flex
    justify-content space-between
    padding: 13px
    line-height 2rem;
    &:nth-child(2n + 1)
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
          let status = 1
          if(index > 4) {
            status = 2
          }
          if(index > 6) {
            status = 3
          }
          temp.push({
            start,
            end,
            status: status,
            id: index + 1
          })
        })
        this.timeConfig = temp;
      })
    },
    borrow(item) {
      // 添加预约时间
      item.status = 2;
      this.$emit('addBorrowTime', item)
    }
  }
}
</script>

