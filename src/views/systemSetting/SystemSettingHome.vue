<style scoped>
.main {
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  padding: 0 15%;
  position: relative;
}

.setting-list {
  width: 100%;
}

.setting-item {
  width: 10vw;
  height: 10vw;
  border: 3px solid #000000;
  border-radius: 10px;
  margin: 3vw 11.6vw;
  text-align: center;
}

.shadow {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #00000054;
  overflow-y: scroll;
}

.popup-content {
  position: absolute;
  width: 50%;
  left: 0;
  right: 0;
  margin: 5% auto 0;
  overflow-y: scroll;
  background: #ffffff;
  border-radius: .5rem;
}

.password-shadow {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
}

.password-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  width: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
}

.confirm-button {
  text-align: center;
  padding-top: 10px;
}

.check-button {
  width: 50px;
  height: 50px;
}
</style>
<template>
  <div class="main">
    <div class="setting-list">
      <div>
        <van-field
            readonly
            clickable
            name="area"
            v-model="classroom"
            label="教室绑定"
            placeholder="点击选择教室"
            @click="openPicker"
        />
      </div>
      <div>
        <van-field
            v-model="serviceUrl"
            type="text"
            label="服务器地址"
        >
          <template #button>
            <van-button size="small" @click="checkConnect" type="primary">检查连接</van-button>
          </template>
        </van-field>

      </div>
      <div @click="exitApp">
        <van-field
            readonly
            type="text"
            label="退出app"
            right-icon="revoke"
        >
        </van-field>
      </div>
    </div>

    <div class="password-shadow" v-if="showPassword">
      <div class="password-content">
        <div>
          <van-field v-model="managerAccount.account" label="管理账号" placeholder="请输入管理账号"/>
        </div>
        <div>
          <van-field v-model="managerAccount.password" type="password" label="管理密码" placeholder="请输入管理密码"/>
        </div>
        <div class="confirm-button">
          <van-button @click="submit" type="primary">确认</van-button>
        </div>
      </div>
    </div>
    <teleport to="body">
      <div class="shadow" @click.self="showPicker = false" v-if="showPicker">
        <div class="popup-content">
          <van-cascader
              v-model="cascaderValue"
              title="请选择教室"
              :options="options"
              @close="showPicker = false"
              @finish="onFinish"></van-cascader>
        </div>
      </div>
    </teleport>
    <PasswordLogin @loginSuccess="handleLoginSuccess" ref="pswLogin"></PasswordLogin>



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


export default {
  components: {
    PasswordLogin
  },
  data() {
    let mac = 'xxxxxx'
    if (window.device) {
      mac = window.device.uuid;
    }
    return {
      showPassword: false,
      serviceConnect: false,
      serviceUrl: 'http://192.168.1.140:80',
      options: [],
      cascaderValue: '',
      classroom: '',
      showPicker: false,
      mac: mac,
      managerAccount: {
        account: 'admin',
        password: 'admin'
      }
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
    }
  }
}
</script>
