<style scoped>

</style>
<template>
  <div class="main">
    <div>
      考试时间： {{ time }}
      考场号： 123
      考试科目： 数学
    </div>
    <button @click="show">123123123</button>
    <Login ref="login"></Login>
  </div>
</template>

<script>
import Login from "@/components/LoginPanel/Login";
import timeUtil from "@/util/timeUtil";

export default {
  name: 'Exam-Mode',
  components: {
    Login
  },
  data() {
    return {
      time: timeUtil.formatTime(new Date())
    }
  },
  mounted() {

  },
  methods: {
    show() {
      this.$refs.login.visible = true;
    }
  }
}
</script>
