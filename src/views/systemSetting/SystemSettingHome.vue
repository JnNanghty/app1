<style scoped>
.main {
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  padding: 0 15%;
  position: relative;
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

.password-content > ion-item {
  color: #ffffff;
}

.confirm-button {
  width: 20%;
  font-size: .8rem;
  display: block;
  margin: 10px auto 0;
}

.check-button {
  width: 50px;
  height: 50px;
}
</style>
<template>
  <div class="main">
    <div>
      <div @click="openPicker">
        <div>教室绑定</div>
        <div>{{ classroom }}</div>
      </div>
      <div>
        <div>服务器地址</div>
        <button class="check-button" @click="checkConnect">检查</button>
        <input v-model="serviceUrl" type="text"/>
      </div>
      <div @click="exitApp">
        <div>退出app</div>
        <i>exit icon</i>
      </div>
    </div>
    <div class="password-shadow" v-if="showPassword">
      <div class="password-content">
        <div>
          <div>请输入管理账号</div>
          <input v-model="managerAccount.account"/>
        </div>
        <div>
          <div>请输入管理密码</div>
          <input type="password" v-model="managerAccount.password"/>
        </div>
        <button class="confirm-button" @click="submit">确认</button>
      </div>
    </div>
    <div to="body">
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
    </div>
    <Login @loginSuccess="handleLoginSuccess" ref="login"></Login>
  </div>
</template>


<script>
import ls from "@/store/ls";
import service from "@/api/services";
import {msg} from "@/components/message";
import mitt from "@/util/mitt";
import {Cascader as VanCascader} from 'vant';
import 'vant/lib/cascader/style';
import Login from "@/components/LoginPanel/Login";
import {getToken, setToken} from "@/util/auth";

export default {
  components: {
    VanCascader,
    Login
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
          this.$refs.login.visible = true;
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
        }
      }, err => {
        ls.remove('serviceUrl')
      })
    },
    openPicker() {
      const serviceUrl = ls.get('serviceUrl');
      if (serviceUrl) {
        const token = getToken();
        if (token) {
          this.showPicker = true;
        } else {
          this.$refs.login.visible = true;
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
        }
      }, () => {
        msg({
          message: '绑定失败！'
        });
      })
    },
    exitApp() {
      console.log('退出app')
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
