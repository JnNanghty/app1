<style scoped>

</style>
<template>
  <div class="main">
    <div>
      考试时间： {{ examData.examStartDate }}
      考场号： {{ examData.examRoomNo }}
      考试科目： {{ examData.examSubject }}
    </div>
  </div>
</template>

<script>
import timeUtil from "@/util/timeUtil";

export default {
  name: 'Exam-Mode',
  components: {
  },
  data() {
    return {
      examData: {
        examRoomNo: '考场号',
        examStartDate: '开始时间',
        examSubject: '考试科目'
      }
    }
  },
  created() {
    const data = this.$route.params.data;
    this.examData = JSON.parse(data);
  },
  mounted() {},
  methods: {
    show() {
    }
  }
}
</script>
