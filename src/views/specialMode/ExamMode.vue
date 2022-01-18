<style scoped>

</style>
<template>
  <IonPage class="main">
    <div>
      考试时间： {{ timeUtil.formatTime(time) }}
      考场号： 123
      考试科目： 数学
    </div>
    <button @click="show">123123123</button>
    <Login ref="login"></Login>
  </IonPage>
</template>

<script setup>
import {IonPage} from "@ionic/vue";
import {ref} from "vue";
import timeUtil from "@/util/timeUtil";
import Login from "@/components/LoginPanel/Login";

const time = ref(new Date());
</script>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Exam-Mode',
  mounted() {
  },
  methods: {
    show() {
      this.$refs.login.visible = true;
    }
  }
})
</script>

