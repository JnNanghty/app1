<style scoped lang="stylus">
@import "~@/theme/mixin.styl";

.main
  width: 100%;
  height: 100%;
  get_font_color(font_color)
  display flex
  padding: 10px 40px 0;
  box-sizing border-box
.left
  width: 50%
.right
  flex 1
  margin-left: 1rem
.wrap
  get_background(borrow_wrap_background)
  border-radius 8px
  padding: 15px 25px
  box-sizing border-box
  margin-bottom: 10px
  border 2px solid rgba(0,0,0,0)
.change-button
  border-radius 8px
  get_background(borrow_change_button_background)
  text-align center
  padding: 6px 20px;
  font-size 14px;

.wrap-active
  border 2px solid #FDA45E

.wrap1
  display flex
  .w1-left
    width: 70%;
    .w1-room-name
      font-size 32px;
      white-space nowrap
      overflow: hidden;
      text-overflow ellipsis;
  .w1-right
    width: 30%
    display flex
    justify-content flex-end
    align-items center
.wrap2
  .w2-top
    display flex
    justify-content space-between
  .w2-bottom
    display flex
    margin-top: 5px
    .borrow-time-wrap
      overflow-x: scroll
      .borrow-time-item
        border-radius 6px;
        padding: 4px 20px 4px 5px
        height: 100%
        background: #677181;
        box-sizing border-box
        margin-left: 10px
        position relative
        .close-icon
          position absolute
          top: 50%
          right: 1rem;
          img
            width: 8px
            height @width
.wrap3
  display flex
.reason-input
  padding-top: 5px
  padding-bottom: @padding-top
</style>
<template>
  <div class="main">
    <div class="left">
      <div @click="selectWrap(0)" :class="activeWrap === 0 ? 'wrap-active' : ''" class="wrap wrap1">
        <div class="w1-left">
          <div>预约教室：</div>
          <div class="w1-room-name">{{formData.terminal.label}}</div>
        </div>
        <div class="w1-right">
          <div class="change-button">切换教室</div>
        </div>
      </div>
      <div @click="selectWrap(1)" :class="activeWrap === 1 ? 'wrap-active' : ''" class="wrap wrap2">
        <div class="w2-top">
          <div>预约日期: {{formData.date}}</div>
          <div class="change-button">切换教室</div>
        </div>
        <div class="w2-bottom">
          <div>
            <span>预约时段:</span>
            <br>
            <span style="font-size: 12px;">支持多选</span>
          </div>
          <div class="borrow-time-wrap">
            <div class="borrow-time-item" v-for="(item, index) in borrowTime">
              <div>第{{index + 1}}节</div>
              <div>{{ item.start }}-{{ item.end }}</div>
              <div class="close-icon" @click="removeBorrowTime(item)"><img src="../../assets/close_icon.png" alt=""></div>
            </div>
          </div>
        </div>
      </div>
      <div @click="selectWrap(2)" :class="activeWrap === 2 ? 'wrap-active' : ''" class="wrap wrap3">
        <div>申请理由：</div>
        <input class="_input reason-input" type="text" placeholder="选填">
      </div>
      <div class="_button">提交申请</div>
    </div>
    <div class="right">
      <component :is="rightComponentName"></component>
    </div>
  </div>
</template>
<script>
import service from "@/api/services";
import ls from "@/store/ls";
import {msg} from "@/components/message";
import ClassroomSelect from "@/views/classroomBorrow/components/ClassroomSelect";
import DateSelect from "@/views/classroomBorrow/components/DateSelect";
import Reason from "@/views/classroomBorrow/components/Reason";
import mitt from "@/util/mitt";

export default {
  components: {
    ClassroomSelect,
    DateSelect,
    Reason
  },
  data() {
    return {
      formData: {
        terminal: {
          id: '',
          label: ''
        },
        date: Date.now(),
        reason: []
      },
      rightComponentName: 'ClassroomSelect',
      terminalInfo: {},
      activeWrap: 0,
      componentArray: ['ClassroomSelect', 'DateSelect', 'Reason'],
      date: Date.now(),
      timeSelect: [],
      borrowTime: []
    }
  },
  created() {
    this.terminalInfo = ls.get('terminalInfo'); // 默认值
    this.formData.terminal = ls.get('terminalInfo');

    mitt.on('updateSelect', this.setTerminal)
    mitt.on('changeDate', this.changeDate)
    mitt.on('addBorrowTime', this.addBorrowTime)
  },
  beforeUnmount() {
    mitt.off('updateSelect', this.setTerminal);
    mitt.off('changeDate', this.changeDate)
    mitt.off('addBorrowTime', this.addBorrowTime)
  },
  mounted() {
    const userInfo = ls.get('userInfo');
    if (userInfo) {
    } else {
      msg({
        message: '请先登录!'
      });
    }
  },
  methods: {
    selectWrap(index) {
      this.activeWrap = index;
      this.rightComponentName = this.componentArray[index];
    },
    setTerminal(item) {
      this.formData.terminal = item;
      this.getBorrowTime();
    },
    changeDate(date) {
      this.date = date
      this.getBorrowTime()
    },
    getBorrowTime() {
      this.timeSelect = []
      service.post('course/getBorrowTerminalTime', {
        date: this.date,
        terminalId: this.terminalInfo.id
      }).then(res => {
        // 要被禁用的时间
      })
    },
    addBorrowTime(item) {
      this.borrowTime.push(item)
    },
    removeBorrowTime(item) {
      this.borrowTime = this.borrowTime.filter(i => i.id !== item.id)
    }
  }
}
</script>
