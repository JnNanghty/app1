<style scoped lang="stylus">
.ss-main-content {
  display: flex;
  get_font_color(font_color)
  height: 100%;
  width: 100%

  .ss-main-left {
    margin-right: 0.75rem
  }

  .ss-main-left,
  .ss-main-right {
    flex: 1;
    get_background(setting_panel_bancground)
    border-radius .35rem;
    padding-top: .7rem
    padding-left: 1.25rem
    position relative
  }
}

.form-content {
  margin-left: 0.55rem
}

.form-title {
  margin-bottom: 1.15rem
  font-size 1rem;
}

.form-row {
  display flex;

  .form-item-inline {
    flex: 1
  }
}

.form-item {
  margin-bottom: 0.85rem

  .form-input {
    max-width: 19.5rem;
    height: 2rem
    border-radius .4rem;
  }
}

.form-item-inline {
  margin-bottom: 1.3rem
  display flex;

  .form-label {
    width 2.5rem;
    white-space nowrap;
    margin-right: 0.65rem
    line-height 2rem;
    text-align right
  }

  .form-select {
    height: 2rem
    width: 16rem;
  }

  .form-input {
    max-width: 19.5rem;
    height: 2rem
    border-radius .4rem;
  }
}

.form-label {
  margin-bottom: 0.35rem
  font-size 0.7rem;
}


.submit-button {
  text-align center;
  background-color: #FDA45E;
  border-radius 0.4rem;
  width: 15.5rem
  height: 2rem
  line-height @height;
  bottom: 0.85rem
  position absolute
  left: 0
  right: 0
  margin: 0 auto;
}
</style>
<template>
  <div class="ss-main-content">
    <div class="ss-main-left">
      <h3 class="form-title">融合平台地址信息</h3>
      <form class="form-content">
        <div class="form-item">
          <div class="form-label">迈杰云平台</div>
          <input class="form-input _input" v-model="serviceUrl" style="width: 19.5rem">
        </div>
        <div class="submit-button _button" @click="checkIp" v-if="!offline">保存</div>
      </form>
    </div>
    <div class="ss-main-right">
      <h2 class="form-title">当前绑定教室信息</h2>
      <form class="form-content">
        <!--        <div class="form-row">-->
        <div class="form-item-inline">
          <div class="form-label">当前校区</div>
          <my-select class="form-select _select" :len="campus.length + 1" :value="schoolInfo.campus.label">
            <my-option @select="campusSelected" v-for="item in campus" :value="item.id" :label="item.label"></my-option>
          </my-select>
        </div>
        <div class="form-item-inline">
          <div class="form-label">教学楼</div>
          <my-select class="form-select _select" :len="category.length" :value="schoolInfo.category.label">
            <my-option @select="categorySelected" v-for="item in category" :value="item.id"
                       :label="item.label"></my-option>
          </my-select>
        </div>
        <!--        </div>-->
        <!--        <div class="form-row">-->
        <div class="form-item-inline">
          <div class="form-label">当前楼层</div>
          <my-select class="form-select _select" :len="floor.length" :value="schoolInfo.floor.label">
            <my-option @select="floorSelected" v-for="item in floor" :value="item.id" :label="item.label"></my-option>
          </my-select>
        </div>
        <div class="form-item-inline">
          <div class="form-label">当前教室</div>
          <my-select class="form-select _select" :len="terminal.length" :value="schoolInfo.terminal.label">
            <my-option @select="terminalSelected" v-for="item in terminal" :value="item.id"
                       :label="item.label"></my-option>
          </my-select>
        </div>
        <!--        </div>-->
        <div class="submit-button _button" @click="bind" v-if="!offline">切换绑定</div>
      </form>
    </div>
  </div>
</template>

<script>
import service from "@/api/services";
import {msg} from "@/components/message";
import {removeToken} from "@/util/auth";
import ls from "@/store/ls";
import mitt from "@/util/mitt";
import {initMqtt} from "@/util/mqttUtil";

export default {
  name: "BindClassroom",
  data() {
    let mac = 'aa'
    if (window.device) {
      mac = window.device.uuid;
    }
    return {
      serviceUrl: '',
      terminals: [],
      schoolInfo: {
        campus: {
          label: '请选择校区',
          value: -1
        }, // 校区
        category: {
          label: '请选择教学楼',
          value: -1
        }, // 教学楼
        floor: {
          label: '请选择楼层',
          value: -1
        }, // 楼层
        terminal: {
          label: '请选择教室',
          value: -1
        }
      },
      campus: [],
      mac,
      message: '',
      terminalId: null,
      offline: false
    }
  },
  created() {
    this.serviceUrl = ls.get('serviceUrl') || '';
    this.terminalId = +ls.get('terminalId')
  },
  computed: {
    category() {
      let r = []
      this.campus.some(i => i.id === this.schoolInfo.campus.value && (r = i.children))
      return r
    },
    floor() {
      let r = []
      this.category.some(i => i.id === this.schoolInfo.category.value && (r = i.children))
      return r
    },
    terminal() {
      let r = []
      this.floor.some(i => i.id === this.schoolInfo.floor.value && (r = i.children))
      return r
    }
  },
  mounted() {
    this.offline = !!ls.get('userInfo').offline;
    if (this.serviceUrl) {
      if (!this.offline) {
        this.getTerminal();
      }
    }
  },
  methods: {
    campusSelected(item) {
      this.schoolInfo.campus = item;
      this.schoolInfo.category = {label: '请选择教学楼', value: -1};
      this.schoolInfo.floor = {label: '请选择楼层', value: -1};
      this.schoolInfo.terminal = {label: '请选择教室', value: -1};
    },
    categorySelected(item) {
      this.schoolInfo.category = item
      this.schoolInfo.floor = {label: '请选择楼层', value: -1};
      this.schoolInfo.terminal = {label: '请选择教室', value: -1};
    },
    floorSelected(item) {
      this.schoolInfo.floor = item
      this.schoolInfo.terminal = {label: '请选择教室', value: -1};
    },
    terminalSelected(item) {
      this.schoolInfo.terminal = item
    },
    // 查教室树
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
          this.campus = res.list;
          if (this.terminalId) {
            this.setCurrentTerminal();
          }
          resolve();
        }, () => {
          msg({
            message: '没有权限！请重新登录！',
            type: 'wrong'
          });
          removeToken()
          ls.remove('userInfo');
          reject();
        });
      })
    },
    // 检查连接
    checkIp() {
      let url = ls.get('serviceUrl');
      ls.set('serviceUrl', this.serviceUrl.toLowerCase());
      service.post('classCard/testLink').then(res => {
        if (res.message === 'success') {
          msg({
            message: '连接成功!',
            type: 'success'
          });
          this.getTerminal();
          initMqtt();
        } else {
          ls.set('serviceUrl', url);
          msg({
            message: '配置服务器地址失败!',
            type: 'wrong'
          });
        }
      }, () => {
        ls.set('serviceUrl', url);
        msg({
          message: '连接服务器失败!',
          type: 'wrong'
        });
      })
    },
    bind() {
      this.bindTerminal()
      // const terminalId = ls.get('terminalId');
      // if (terminalId) {
      //   this.changeBind()
      // } else {
      //   this.bindTerminal()
      // }
    },
    // 绑定教室
    bindTerminal() {
      service.post('classCard/bindingTerminal', {
        terminal: this.schoolInfo.terminal.value,
        mac: this.mac
      }).then(res => {
        ls.set('companyId', res.data);
        if (res.message === 'success') {
          ls.set('terminalId', this.schoolInfo.terminal.value);
          msg({
            message: '绑定成功！',
            type: 'success'
          });
        }
      }, () => {
        msg({
          message: '绑定失败！',
          type: 'wrong'
        });
      })
    },
    // 改了， 不要了
    changeBind() {
      service.post('classCard/changeBinding', {
        terminal: this.schoolInfo.terminal.value,
        mac: this.mac
      }).then((res) => {
        if (res.message === 'success') {
          ls.set('terminalId', this.schoolInfo.terminal.value);
          msg({
            message: '绑定成功！',
            type: 'success'
          });
        }
      }, () => {
        msg({
          message: '绑定失败！',
          type: 'wrong'
        });
      })
    },
    setCurrentTerminal() {
      // 根据当前的terminalId 找出对应的楼层教学楼校区等.
      this.campus.forEach(cam => {
        cam.children.forEach(cat => {
          cat.children.forEach(flo => {
            flo.children.forEach(ter => {
              if (ter.id === this.terminalId) {
                this.schoolInfo.campus = {
                  label: cam.label,
                  value: cam.id
                };
                this.schoolInfo.category = {
                  label: cat.label,
                  value: cat.id
                };
                this.schoolInfo.floor = {
                  label: flo.label,
                  value: flo.id
                };
                this.schoolInfo.terminal = {
                  label: ter.label,
                  value: ter.id
                };
              }
            })
          })
        })
      })
    }
  }
}
</script>
