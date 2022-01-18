<style scoped>
.main {
  padding: 1rem 5rem 0;
}

.tabs-label {
  display: flex;
  position: relative;
  margin-bottom: .5rem;
}

.tabs-label-item {
  color: #ffffff;
  margin: 0 .5rem;
  font-size: .9rem;
}

.tabs-active {
  position: absolute;
  top: 0;
  left: .5rem;
  width: 3rem;
  height: .25rem;
  background: #0059ff;
  transform-origin: center center;
  transform: translateY(-100%);
  transition: all .3s ease;
}

.tabs-pane {
  overflow: hidden;
  width: 100%;
  height: 85%;
}

.tabs-pane-item {
  width: 100%;
  height: 100%;
  float: left;
}

.no-mode-fade-enter-active, .no-mode-fade-leave-active {
  transition: opacity .3s
}

.no-mode-fade-enter-from, .no-mode-fade-leave-to {
  opacity: 0
}
</style>
<template>
  <div class="main">
    <div class="tabs-label">
      <div class="tabs-label-item" v-for="(item, index) in tabsLabelArray"
           @click="changeActiveIndex(index)" ref="tabsLabelItem"
           :key="index" v-show="!item.hidden">
        {{ item.label }}
      </div>
      <div class="tabs-active" :style="activeStyle"></div>
    </div>
    <div class="tabs-pane">
      <transition name="no-mode-fade">
        <div class="tabs-pane-item" v-if="activeIndex === 0">
          <TodayCurriculum></TodayCurriculum>
        </div>
        <div class="tabs-pane-item" v-else-if="activeIndex === 1">
          <WeekCurriculum></WeekCurriculum>
        </div>
        <div class="tabs-pane-item" v-else-if="activeIndex === 2">
          <img src="" alt="校历">
        </div>
        <div class="tabs-pane-item" v-else-if="activeIndex === 3">
          <PersonalCurriculum></PersonalCurriculum>
        </div>
      </transition>
    </div>
    <Login ref="login" @loginSuccess="handleLoginSuccess"></Login>
  </div>
</template>
<script>
import TodayCurriculum from './components/TodayCurriculum.vue';
import WeekCurriculum from "./components/WeekCurriculum";
import PersonalCurriculum from "./components/PersonalCurriculum";
import Login from "@/components/LoginPanel/Login";
import {getToken} from "@/util/auth";

export default {
  name: 'Curriculum-index',
  components: {TodayCurriculum, WeekCurriculum, PersonalCurriculum, Login,},
  data() {
    return {
      tabsLabelArray: [{
        label: '当日课表',
        hidden: false
      }, {
        label: '周课表',
        hidden: false
      }, {
        label: '校历',
        hidden: false
      }, {
        label: '个人课表',
        hidden: false
      }],
      activeIndex: 0,
      activeStyle: {
        left: 0,
        width: 0
      }
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.changeActiveIndex(0);
      }, 0);
    });
  },
  methods: {
    changeActiveIndex(index) {
      if (index === 3) {
        const token = getToken();
        if (!token) {
          this.showLogin();
          return;
        }
      }
      this.activeIndex = index;
      const {x, width} = this.$refs.tabsLabelItem[this.activeIndex].getBoundingClientRect();
      this.activeStyle = {
        left: 'calc(' + x + 'px - 5rem)',
        width: width + 'px'
      };
    },
    showLogin() {
      this.$refs.login.visible = true;
    },
    handleLoginSuccess() {
      this.changeActiveIndex(3);
    }
  }
}
</script>

