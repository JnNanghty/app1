<style scoped>
.main {
  padding: 0 5rem;
}

.list-item {
  color: #ffffff;
  height: 2rem;
  line-height: 2rem;
  border: 2px solid #ffffff;
  border-radius: 20px;
  margin: 0 10px 20px;
  padding-left: 10px;
}
</style>
<template>
  <div class="main">
<!--    <div>-->
<!--      <div class="list-item" v-for="(item, index) in borrowList" :key="item.id" @click="goPage(item.id)">-->
<!--        {{ item.creator && item.creator.label }} {{ item.room && item.room.label }}-->
<!--        {{ item.status && item.status.label }} {{ item.reason }} {{ index }}-->
<!--      </div>-->
<!--    </div>-->
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadData"
    >
      <div class="list-item" v-for="(item, index) in borrowList" :key="item.id" @click="goPage(item.id)">
        {{ item.creator && item.creator.label }} {{ item.room && item.room.label }}
        {{ item.status && item.status.label }} {{ item.reason }} {{ index }}
      </div>
    </van-list>
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
