<style scoped lang="stylus">
@import "~@/theme/mixin.styl";

.main
  width: 100%;
  height: 100%;
  get_font_color(font_color)
  display flex
  padding: 0 40px;
  box-sizing border-box
.left, .right
  flex 1

.wrap
  get_background(borrow_wrap_background)
  border-radius 8px
  padding: 20px 30px
  box-sizing border-box
  margin-bottom: 10px
.change-button
  border-radius 8px
  get_background(borrow_change_button_background)
  text-align center
  padding: 6px 20px;
  font-size 14px;
.wrap1
  display flex
  .w1-left
    flex 1
    .w1-room-name
      font-size 32px
  .w1-right
    width: 30%
.wrap2
  .w2-top
    display flex
  .w2-bottom
    display flex

.wrap3
  display flex
</style>
<template>
  <div class="main">
    <div class="left">
      <div class="wrap wrap1">
        <div class="w1-left">
          <div>预约教室：</div>
          <div class="w1-room-name">预约的教室123</div>
        </div>
        <div class="w1-right">
          <div class="change-button">切换教室</div>
        </div>
      </div>
      <div class="wrap wrap2">
        <div class="w2-top">
          <div>预约日期: </div>
          <div>切换教室</div>
        </div>
        <div class="w2-bottom">
          <div>
            <span>预约时段:</span>
            <br>
            <span>支持多选</span>
          </div>
          <div></div>
        </div>
      </div>
      <div class="wrap wrap3">
        <div>申请理由：</div>
        <input class="_input" type="text" placeholder="选填">
      </div>
      <div>提交申请</div>
    </div>
    <div class="right"></div>
  </div>
</template>
<script>
import service from "@/api/services";
import ls from "@/store/ls";
import {msg} from "@/components/message";


export default {
  data() {
    return {
      borrowList: [],
      count: 10,
      totalCount: 0,
      userId: null,
      loading: false,
      finished: false
    }
  },
  mounted() {
    const userInfo = ls.get('userInfo');
    if (userInfo) {
      this.userId = userInfo.extraInformation.role.id;
      this.getBorrowList()
    } else {
      msg({
        message: '请先登录!'
      });
    }
  },
  methods: {
    getBorrowList() {
      service.post('model/getEntities', {
        target: 'terminalBorrow',
        start: 0,
        count: this.count,
        orderBy: ['id DESC'],
        extraFilter: {
          field: 'creator',
          match: 'EQ',
          value: this.userId
        },
        retFields: ['creator', 'room', 'start', 'end', 'time', 'status', 'reason']
      }).then(res => {
        this.borrowList = res.list;
        this.totalCount = res.totalCount;
        this.loading = false;
      });
    },
    goPage(id) {
      this.$router.push({
        name: 'ClassroomBorrowDetail',
        params: {
          id: id
        }
      })
    },
    loadData() {
      this.count += 5;
      this.getBorrowList()
      if (this.count >= this.totalCount) {
        this.finished = true;
      }
    }
  }
}
</script>
