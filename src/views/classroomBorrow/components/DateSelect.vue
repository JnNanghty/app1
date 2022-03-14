<style lang="stylus" scoped>
.ds-top
  get_background(borrow_wrap_background)
  border-radius 8px;
</style>
<template>
  <div class="ds-main">
    <div class="ds-top">
      <div class="icon " @click="changeDate('pre')"></div>
      <div>{{ currentTime }}</div>
      <div class="icon " @click="changeDate('next')"></div>
    </div>
    <div class="ds-content"></div>
  </div>
</template>

<script>
import timeUtil from "@/util/timeUtil";

export default {
  name: "DateSelect",
  data() {
    return {
      date: Date.now(),
    }
  },
  computed: {
    currentTime() {
      return timeUtil.formatDate(this.date, '-') + '  (' + timeUtil.getCurrentDay(this.date) + ')';
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changeDate(name) {

    }
  }
}
</script>

