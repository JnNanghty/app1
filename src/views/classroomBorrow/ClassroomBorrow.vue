<style scoped lang="stylus">
@import "~@/theme/mixin.styl";

.main
  width: 100%;
  height: 100%;
  get_font_color(font_color)
  display flex
  padding: .5rem 2rem 0;
  box-sizing border-box
  font-size .6rem;

.left
  width: 50%
  display: flex;
  flex-direction: column;
  justify-content: space-between;

.right
  flex 1
  margin-left: 1rem

.wrap
  get_background(borrow_wrap_background)
  border-radius .4rem;
  box-sizing border-box
  margin-bottom: .5rem
  border 2px solid rgba(0, 0, 0, 0)
  font-size .8rem;

.change-button
  border-radius 8px
  get_background(borrow_change_button_background)
  text-align center
  padding: .3rem 1rem
  font-size .7rem;

.wrap-active
  border 2px solid #FDA45E

.wrap1
  display flex
  padding: 1rem 1.5rem

  .w1-left
    width: 70%;

    .w1-room-name
      font-size 1.6rem;
      white-space nowrap
      overflow: hidden;
      text-overflow ellipsis;

  .w1-right
    width: 30%
    display flex
    justify-content flex-end
    align-items center

.wrap2
  padding: 1rem 1.5rem

  .w2-top
    display flex
    justify-content space-between
    margin-bottom: 1rem;

  .w2-bottom
    display flex
    margin-top: 5px
    white-space: nowrap;

    .borrow-time-wrap
      flex: 1;
      overflow-x: scroll
      padding-top: 5px

      .borrow-window
        width: 1000%
        display flex

        .borrow-time-item
          border-radius 6px;
          padding: .2rem 1rem .2rem .25rem;
          height: 100%
          get_background(borrow_date_selected_background)
          box-sizing border-box
          margin-left: 10px
          position relative

          .close-icon
            position absolute
            top: 50%
            right: 5px;
            transform translateY(-50%)

            img
              width: .8rem;
              height @width

.wrap3
  padding: .55rem 1.5rem
  display flex

.reason-input
  height: 1.8rem;
  flex: 1;

.submit-button
  width: 13rem
</style>
<template>
  <div class="main">
    <div class="left">
      <div @click="selectWrap(0)" :class="activeWrap === 0 ? 'wrap-active' : ''" class="wrap wrap1">
        <div class="w1-left">
          <div>预约教室：</div>
          <div class="w1-room-name">{{ formData.terminal.label }}</div>
        </div>
        <div class="w1-right">
          <div class="change-button">切换教室</div>
        </div>
      </div>
      <div @click="selectWrap(1)" :class="activeWrap === 1 ? 'wrap-active' : ''" class="wrap wrap2">
        <div class="w2-top">
          <div>预约日期: <span style="font-size: 1rem;margin-left: .5rem;">{{ borrowDateText }}</span></div>
          <div class="change-button">更改日期</div>
        </div>
        <div class="w2-bottom">
          <div style="padding-top: 5px;">
            <span style="font-size: .8rem">预约时段:</span>
            <br>
            <span style="font-size: .6rem;color: #FDA45E;">支持多选</span>
          </div>
          <div class="borrow-time-wrap">
            <div class="borrow-window" :style="windowWidth">
              <div class="borrow-time-item" v-for="(item) in borrowTime" :key="item.id">
                <div style="font-size: .5rem;">第{{ item.id }}节</div>
                <div style="font-size: .7rem;">{{ item.start }}-{{ item.end }}</div>
                <div class="close-icon" @click="removeBorrowTime(item)"><img src="../../assets/close_icon.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div @click="selectWrap(2)" :class="activeWrap === 2 ? 'wrap-active' : ''" class="wrap wrap3">
        <div style="font-size: .8rem;line-height: 1.8rem">申请理由：</div>
        <input v-model="formData.reason" class="_input reason-input" type="text" placeholder="选填">
      </div>
      <div class="submit-button _button" @click="submit">提交申请</div>
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
import {myConfirm} from "@/components/confirm";
import timeUtil from "@/util/timeUtil";
import {computed} from 'vue'

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
        reason: ''
      },
      rightComponentName: 'ClassroomSelect',
      terminalInfo: {},
      activeWrap: 0,
      componentArray: ['ClassroomSelect', 'DateSelect', 'Reason'],
      borrowTime: [],
      cantBorrowDuration: []
    }
  },
  provide() {
    return {
      reasonText: computed(() => this.formData.reason),
      cantBorrowTime: computed(() => this.cantBorrowDuration)
    }
  },
  computed: {
    borrowDateText() {
      return timeUtil.formatDate(this.formData.date, '-');
    },
    windowWidth() {
      let w = this.borrowTime.length * 5 + 0.5
      return {
        width: w + 'rem'
      }
    }
  },
  created() {
    this.terminalInfo = ls.get('terminalInfo'); // 默认值
    this.formData.terminal = ls.get('terminalInfo');

    this.getBorrowTime();
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
      this.formData.date = date;
      this.getBorrowTime()
    },
    getBorrowTime() {
      // 清空已经借用的时间
      this.borrowTime = [];
      service.post('course/getBorrowTerminalTime', {
        date: this.formData.date,
        terminalId: this.formData.terminal.id
      }).then(res => {
        // 要被禁用的时间
        this.cantBorrowDuration = res;
      })
    },
    addBorrowTime(item) {
      this.borrowTime.push(item)
    },
    removeBorrowTime(item) {
      item.status = 1;
      this.borrowTime = this.borrowTime.filter(i => i.id !== item.id)
    },
    submit() {
      let self = this
      if (this.borrowTime.length <= 0) {
        msg({
          message: '请选择借用时间',
          type: 'wrong'
        });
        return;
      }
      if(!this.checkBorrowTime()) {
        msg({
          message: '请选择连续的时间',
          type: 'wrong'
        });
        return ;
      }
      myConfirm({
        message: '确认提交吗？',
        ok() {
          let start = self.borrowTime[0].start.split(':');
          let end = self.borrowTime[self.borrowTime.length - 1].end.split(':');
          let sh = start[0]
          let sm = start[1]
          let eh = end[0]
          let em = end[1]
          let date = new Date(self.formData.date)
          date.setHours(sh)
          date.setMinutes(sm)
          let date2 = new Date(self.formData.date)
          date2.setHours(eh)
          date2.setMinutes(em)
          service.post('course/applyTerminalBorrow', {
            start: date,
            end: date2,
            room: self.formData.terminal.id,
            reason: self.formData.reason
          }).then(() => {
            msg({
              message: '提交成功',
              type: 'success'
            })
          }, () => {
            msg({
              message: '提交失败',
              type: 'wrong'
            })
          })
        }
      })
    },
    checkBorrowTime() {
      let ids = []
      this.borrowTime.forEach(item => {
        ids.push(item.id)
      })
      ids.sort((a, b) => a - b)
      let len = ids.length;
      if (len === 1) return true;
      for (let i = 0; i < len - 1; i++) {
        if (ids[i] + 1 !== ids[i + 1]) {
          return false;
        }
      }
      return true;
    }
  }
}
</script>
