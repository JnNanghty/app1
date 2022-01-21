<template>
  <div id="app">
    <transition name="up">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import mitt from "@/util/mitt";
export default {
  data() {
    return {}
  },
  mounted() {
    mitt.on('mqttExam', (data) => {
      this.$router.push({
        name: 'ExamMode',
        params: {
          data
        }
      });
    });

    mitt.on('mqttProgramme', (data) => {
      this.$router.push({
        name: 'ProgrammeMode',
        params: {
          data
        }
      });
    })
  },
  methods: {

  }
}
</script>
<style>
#app{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url("./assets/default_background.jpg") no-repeat;
  background-size: cover;
}
.up-enter-active {
  /*transition: transform .5s, opacity .5s;*/
}
.up-leave-active{
  transition: transform .5s, opacity .5s;
}
.up-leave-to {
  transform: translateY(-50%);
}
.up-leave-to, .up-enter {
  opacity: 0;
}
</style>
