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
  font-size .6rem;


  .tabs-icon {
    text-align center
    margin: 0 auto 9px;
    width: 2rem
    height: @width
    padding: .5rem
    box-sizing border-box
    border-radius 4px

    img {
      width: 1rem
      height: @width
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

.calendar{
  height: 17rem;
  margin: 0 auto;
  display block
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
          <template v-if="!!token">
            <PersonalCurriculum></PersonalCurriculum>
          </template>
          <template v-else>
            <auth></auth>
          </template>
        </div>
        <div class="tabs-pane-item" v-else-if="activeIndex === 3">
          <img class="calendar" src="../../assets/xiaoli.png" alt="">
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import TodayCurriculum from './components/TodayCurriculum.vue';
import WeekCurriculum from "./components/WeekCurriculum";
import PersonalCurriculum from "./components/PersonalCurriculum";
import {getToken} from "@/util/auth";
import mitt from "@/util/mitt";
import Auth from "@/components/authPage/Auth";
import ls from "@/store/ls";

export default {
  name: 'Curriculum-index',
  components: {TodayCurriculum, WeekCurriculum, PersonalCurriculum, Auth},
  data() {
    return {
      tabsLabelArray: [{
        label: '今日课表',
        icon: require('@/assets/curriculum_icon/today.png'),
        name: 'today'
      }, {
        label: '本周课表',
        icon: require('@/assets/curriculum_icon/week.png'),
        name: 'week'
      }, {
        label: '个人课表',
        icon: require('@/assets/curriculum_icon/my.png'),
        name: 'my'
      }, {
        label: '学年校历',
        icon: require('@/assets/curriculum_icon/year.png'),
        name: 'year'
      }],
      activeIndex: 0,
      token: null,
      calendar: ''
    }
  },
  computed: {},
  created() {
    this.token = getToken();
    mitt.on('loginSuccess', this.loginSuccess);
    mitt.on('changeTheme', this.changeTheme3)
    this.changeTheme3();
  },
  mounted() {
    this.$nextTick(() => {
      this.changeActiveIndex(0);
    });
  },
  beforeUnmount() {
    mitt.off('loginSuccess', this.loginSuccess)
    mitt.off('changeTheme', this.changeTheme3)
  },
  methods: {
    loginSuccess() {
      this.token = getToken()
    },
    changeActiveIndex(index) {
      this.activeIndex = index;
      this.$nextTick(() => {
        mitt.emit('hideBackButton')
      })
    },
    changeTheme3() {
      let theme = window.document.documentElement.dataset.theme

      let suffix = ''
      if (theme === 'bright') {
        suffix = '_bright'
      }

      this.tabsLabelArray.forEach(item => {
        item.icon = require(`@/assets/curriculum_icon/${item.name}${suffix}.png`)
      })
    }
  }
}
</script>

