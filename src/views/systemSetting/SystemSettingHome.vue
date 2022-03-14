<style scoped lang="stylus">
.main {
  height: 100%;
  get_font_color(font_color)
}

header {
  height: 3rem
  display flex;
  padding-top: 1.25rem
  padding-left: 2rem
  padding-right: 1.5rem
  box-sizing border-box

  .back-button {
    width: 1rem
    height @width
    background: url("../../assets/icon/back_home.png") no-repeat;
    background-size contain
    background-position center
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
      <div class="">
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
import service from "@/api/services";
import {msg} from "@/components/message";
import mitt from "@/util/mitt";
import PasswordLogin from "@/components/LoginPanel/PasswordLogin";
import {getToken, removeToken} from "@/util/auth";
import {disConnectMqtt, initMqtt} from "@/util/mqttUtil";
import BindClassroom from "@/views/systemSetting/settingItem/BindClassroom";
import SystemSetting from "@/views/systemSetting/settingItem/SystemSetting";

export default {
  components: {
    PasswordLogin, SystemSetting, BindClassroom
  },
  data() {
    let mac = 'xxxxxx'
    if (window.device) {
      mac = window.device.uuid;
    }
    return {
      config: {
        log: ''
      },
      mac: mac,
      componentName: 'BindClassroom',
      activeTabIndex: 0
    }
  },
  mounted() {
    this.showPassword = true;
    const serviceUrl = ls.get('serviceUrl');
    const token = getToken();
    if (serviceUrl && token) {
      this.getTerminal();
    }
    const terminalInfo = ls.get('terminalInfo') || {};
    this.classroom = terminalInfo.label;
  },
  methods: {
    getTerminal() {
      return new Promise((resolve, reject) => {
        service.post('model/getEntityTree', {
          nodes: [{
            subnodes: [{
              type: 'terminal',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: null
              }
            }, {
              type: 'terminalCategory',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: null
              }
            }]
          }, {
            type: 'terminal'
          }, {
            type: 'terminalCategory',
            subnodes: [{
              type: 'terminal',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: '$parentId'
              }
            }, {
              type: 'terminalCategory',
              filter: {
                field: 'parent',
                match: 'EQ',
                value: '$parentId'
              }
            }]
          }]
        }).then(res => {
          this.options = this.initData(res.list);
          resolve();
        }, () => {
          msg({
            message: '没有权限！请重新登录！'
          });
          removeToken()
          ls.remove('userInfo');
          reject();
        });
      })
    },
    initData(list) {
      if (list) {
        return list.map(item => {
          return {
            text: item.label,
            value: item.id,
            children: this.initData(item.children)
          }
        });
      } else return undefined
    },
    checkConnect() {
      ls.set('serviceUrl', this.serviceUrl);
      service.post('classCard/testLink', {}).then(res => {
        if (res.message === 'success') {
          this.serviceConnect = true;
          // this.getTerminal()
          msg({
            message: '连接成功！'
          });
          mitt.emit('refresh');
          initMqtt();
        }
      }, () => {
        ls.remove('serviceUrl')
        msg({
          message: '连接失败！'
        });
      })
    },
    openPicker() {
      const serviceUrl = ls.get('serviceUrl');
      if (serviceUrl) {
        const token = getToken();
        if (token) {
          this.showPicker = true;
        } else {
          this.$refs.pswLogin.visible = true;
        }
      } else {
        msg({
          message: '请先填写服务器地址并检查连接！'
        })
      }
    },
    onFinish({selectedOptions}) {
      let value = '';
      selectedOptions.forEach(item => {
        value += item.text + ' / ';
      });
      this.classroom = value.slice(0, -3);
      this.showPicker = false;

      // 如果已经绑定了，  那么就用切换绑定接口
      const terminalId = ls.get('terminalId');
      if (terminalId) {
        this.changeBind(this.cascaderValue);
      } else {
        this.bindClass(this.cascaderValue);
      }
    },
    bindClass(id) {
      service.post('classCard/bindingTerminal', {
        terminal: id,
        mac: this.mac
      }).then(res => {
        if (res.message === 'success') {
          ls.set('terminalId', id);
          ls.set('companyId', res.data);
          mitt.emit('refresh');
          msg({
            message: '绑定成功！'
          });
          this.$router.replace({
            name: 'Home'
          });
        }
      }, () => {
        msg({
          message: '绑定失败！'
        });
      });
    },
    changeBind(id) {
      service.post('classCard/changeBinding', {
        terminal: id,
        mac: this.mac
      }).then(res => {
        if (res.message === 'success') {
          ls.set('terminalId', id);
          mitt.emit('refresh');
          msg({
            message: '绑定成功！'
          });
          this.$router.replace({
            name: 'Home'
          });
        }
      }, () => {
        msg({
          message: '绑定失败！'
        });
      })
    },
    exitApp() {
      console.log('退出app')
      if (window.cordova) {
        cordova.plugins.exit();
      }
    },
    submit() {
      if (this.managerAccount.account === 'admin' && this.managerAccount.password === 'admin') {
        this.showPassword = false;
      } else {
        msg({
          message: '账号或密码错误！'
        });
      }
    },
    // 选择教室前 必须登录
    handleLoginSuccess() {
      // setToken('6669282:61646D696E36363639323130:1647679075040:24AC842388F6952412B49B8BB74E47BD');
      this.getTerminal().then(() => {
        this.openPicker();
      });
    },
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
