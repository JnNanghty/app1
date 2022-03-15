<style scoped lang="stylus">
@import "~@/theme/mixin.styl";
.main {
  box-sizing: border-box;
  display: flex;
}

.tabs-label {
  position: relative;
  display: flex;
  justify-content space-around
  flex-direction column
  padding: 0 1rem
}

.tabs-label-item {
  get_font_color(font_color);
  text-align center
  white-space nowrap
  font-size 12px;


  .tabs-icon {
    text-align center
    margin: 0 auto 9px;
    width: 40px
    height: 40px
    padding: 10px;
    box-sizing border-box
    border-radius 4px

    img {
      width: 20px
      height: 20px
    }
  }
}

.tabs-active {
  background: #fba35e;
}

.tabs-pane {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.tabs-pane-item {
  width: 100%;
  height: 100%;
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
           @click="changeActiveIndex(index)"
           :key="index">
        <div class="tabs-icon" :class="activeIndex === index ? 'tabs-active' : ''"><img :src="item.icon" alt=""></div>
        <div>{{ item.label }}</div>
      </div>
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
          <PersonalCurriculum></PersonalCurriculum>
        </div>
        <div class="tabs-pane-item" v-else-if="activeIndex === 3">
          <img src="" alt="校历">
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import TodayCurriculum from './components/TodayCurriculum.vue';
import WeekCurriculum from "./components/WeekCurriculum";
import PersonalCurriculum from "./components/PersonalCurriculum";
import Login from "@/components/LoginPanel/Login";
import {getToken} from "@/util/auth";
import mitt from "@/util/mitt";

export default {
  name: 'Curriculum-index',
  components: {TodayCurriculum, WeekCurriculum, PersonalCurriculum, Login,},
  data() {
    return {
      tabsLabelArray: [{
        label: '今日课表',
        icon: require('@/assets/curriculum_icon/today.png')
      }, {
        label: '本周课表',
        icon: require('@/assets/curriculum_icon/week.png')
      }, {
        label: '个人课表',
        icon: require('@/assets/curriculum_icon/my.png')
      }, {
        label: '学年校历',
        icon: require('@/assets/curriculum_icon/year.png')
      }],
      activeIndex: 0
    }
  },
  computed: {},
  created() {
    mitt.on('loginSuccess', this.loginSuccess);
  },
  mounted() {
    this.$nextTick(() => {
      this.changeActiveIndex(0);
    });
  },
  beforeUnmount() {
    mitt.off('loginSuccess', this.loginSuccess)
  },
  methods: {
    loginSuccess() {
      this.activeIndex = 2;
    },
    changeActiveIndex(index) {
      if (index === 2) {
        const token = getToken();
        if (!token) {
          this.$router.push({
            name: 'Auth'
          })
          return;
        }
      }
      this.activeIndex = index;
    },
    showLogin() {
      this.$refs.login.visible = true;
    },
    handleLoginSuccess() {
      this.changeActiveIndex(2);
    }
  }
}
</script>

