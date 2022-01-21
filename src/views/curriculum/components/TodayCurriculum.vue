<style scoped>
.tab-content {
  overflow-y: scroll;
  height: 100%;
}

.list-item {
  color: #ffffff;
  display: flex;
  height: 2rem;
  line-height: 2rem;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.list-item-left {
  border-radius: 8px;
  background: #1036ee;
  flex: 1;
  margin-right: .5rem;
  height: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  white-space: nowrap;
}

.list-item-right {
  border-radius: 8px;
  background: #1036ee;
  flex: 2;
  height: 100%;
  padding-left: 1rem;
  box-sizing: border-box;
  display: flex;
}

.course-name {
  width: 15rem;
  margin-right: 1rem;
  overflow-x: scroll;
  white-space: nowrap;
}

.active-item {
  position: relative;
}

.active-item::before {
  content: '上';
  position: absolute;
  left: 0;
  display: block;
}

</style>
<template>
  <div class="tab-content">
    <div class="list-item" v-for="(item, index) in list" :key="index">
      <div class="list-item-left">
        第{{ one2two(index + 1) }}节 {{ item.startTime }} - {{ item.endTime }}
      </div>
      <template v-if="item.courseNumber">
        <div class="list-item-right">
          <div class="course-name">{{ item.courseName }}</div>
          <div class="">{{ item.teacherName }}</div>
        </div>
      </template>
      <template v-else>
        <div class="list-item-right">空闲</div>
      </template>
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
    }
  },
  mounted() {
    this.terminalId = ls.get('terminalId');
    if (this.terminalId) {
      this.getDailyCurriculum();
    } else {
      msg({
        message: '请先在设置中绑定班级！'
      });
    }
  },
  methods: {
    one2two(time) {
      return timeUtil.one2two(time);
    },
    getDailyCurriculum() {
      service.post('classCard/dailyCurriculum', {
        id: this.terminalId
      }).then(res => {
        this.list = res.data.map(i => {
          const sh = Math.floor(i.startSource / 60);
          const sm = i.startSource % 60;
          i.startTime = timeUtil.one2two(sh) + ':' + timeUtil.one2two(sm);

          const eh = Math.floor(i.endSource / 60);
          const em = i.endSource % 60;
          i.endTime = timeUtil.one2two(eh) + ':' + timeUtil.one2two(em);

          return i;
        });
      });
    }
  }
}
</script>

