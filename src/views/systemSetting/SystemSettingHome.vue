<style scoped lang="stylus">
.main {
  height: 100%;
  get_font_color(font_color)
}

header {
  height: 3rem
  display flex;
  padding-top: .5rem
  padding-left: 2rem
  padding-right: 1.5rem
  box-sizing border-box

  .logo{
    width: 193px
    height: 55px
  }
  .right-content {
    position relative
    padding-top: 0.8rem
    padding-left: 1rem;
    box-sizing border-box
    &::after{
      content: '';
      position absolute
      top: 0
      left: 0
      height: 100%;
      width: 2px
      background-image: linear-gradient(#17191A00, #232323)
    }
  }
  .back-button {
    width: 1rem
    height @width
    get_background_image(back_button_background_image)
    background-size contain
    background-position center
    background-repeat: no-repeat
  }

  .header-center {
    flex: 1;
    text-align: center;
    font-size: 0.9rem;
    padding-top: .5rem;
    &::before {
      content: ''
      display block
      position absolute
      top: 0
      left: 0
      right: 0
      margin: 0 auto;
      width: 2.6rem;
      height: 8px
      background: #FDA45E;
    }
  }


}

main {
  height: calc(100% - 3rem);

  .tab-title {
    width: 100%;
    padding-left: 2rem
    height 2.4rem;
    line-height: @height;
    font-size 0.7rem;
    box-sizing border-box;

    .tab-title-item{
      float left;
      width: 10rem;
      text-align center
      box-sizing border-box
      border-bottom 1px solid;
      border-bottom-color rgba(0, 0, 0, 0)
    }
    .tab-title-item-active{
      position relative;
      border-bottom 1px solid #FDA45E;
      &::after {
        content: '';
        position absolute;
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: linear-gradient(180deg, rgba(51, 57, 65, 0.0001) 11.53%, rgba(123, 96, 77, 0.5) 53.32%, #FDA45E 100%);
        opacity: 0.26;
      }
    }
  }


  .tab-pane{
    height: calc(100% - 2.4rem);
    padding: 0.65rem;
    box-sizing border-box;
  }
}

</style>
<template>
  <div class="main">
    <header>
      <div class="logo">
        <img style="height: 100%;" :src="config.logo" alt="">
      </div>
      <div class="header-center">
        <div style="font-weight: 300">{{ terminalInfo.label }}</div>
        <div v-show="terminalId" style="font-size: .6rem;font-weight: 200">{{ terminalType }} / {{ terminalInfo.seatCount }}座</div>
      </div>
      <div class="user-info">
        <user-info></user-info>
      </div>
      <div class="right-content">
        <div class="back-button" @click="goHome"></div>
      </div>
    </header>
    <main>
      <div class="tab-title">
        <div class="tab-title-item" :class="activeTabIndex === 0 ? 'tab-title-item-active' : ''" @click="changeTab(0)">教室绑定</div>
        <div class="tab-title-item" :class="activeTabIndex === 1 ? 'tab-title-item-active' : ''" @click="changeTab(1)">系统设置</div>
      </div>
      <div class="tab-pane">
        <component :is="componentName"></component>
      </div>
    </main>
  </div>
</template>


<script>
import ls from "@/store/ls";
import BindClassroom from "@/views/systemSetting/settingItem/BindClassroom";
import SystemSetting from "@/views/systemSetting/settingItem/SystemSetting";

export default {
  components: {
    SystemSetting, BindClassroom
  },
  data() {
    return {
      config: {
        log: ''
      },
      componentName: 'BindClassroom',
      activeTabIndex: 0,
      terminalId: null,
      terminalInfo: {},
      terminalTypeList: [
        {id: 7, name: 'media', label: '多媒体教室'},
        {id: 1, name: 'wisdom', label: '智慧教室'},
        {id: 3, name: 'record', label: '录播教室'},
        {id: 4, name: 'computer', label: '计算机教室'},
        {id: 2, name: 'experiment', label: '实验实训室'},
        {id: 5, name: 'art', label: '功能教室'},
        {id: 6, name: 'other', label: '其他'}
      ],
      userInfo: {}
    }
  },
  computed: {
    terminalType() {
      let label = ''
      this.terminalTypeList.forEach(i => {
        if (i.id === this.terminalInfo.type) {
          label = i.label
        }
      })
      return label;
    }
  },
  created() {
    this.terminalInfo = ls.get('terminalInfo') || {};
    this.userInfo = ls.get('userInfo') || {}
  },
  methods: {
    goHome() {
      this.$router.push({
        name: "Home"
      })
    },
    changeTab(index) {
      this.activeTabIndex = index;
      let tabsNameArr = ['BindClassroom', 'SystemSetting'];
      this.componentName = tabsNameArr[index];
    }
  }
}
</script>
