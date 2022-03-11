<style scoped lang="stylus">
.ss-main-content {
  display: flex;
  color #fff;
  height: 100%;
  width: 100%

  .ss-main-left {
    margin-right: 0.75rem
  }

  .ss-main-left,
  .ss-main-right {
    flex: 1;
    background: rgba(66, 72, 81, 0.25);
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
}

.form-row {
  display flex;

  .form-item-inline {
    flex: 1
  }
}

.form-item {
  margin-bottom: 0.85rem
}

.form-item-inline {
  margin-bottom: 1.3rem
  display flex;

  .form-label{
    width 2.5rem;
    white-space nowrap;
    margin-right: 0.65rem
    line-height 2rem;
    text-align right
  }
}

.form-label {
  margin-bottom: 0.35rem
  font-size 0.7rem;
}

.form-input {
  max-width: 19.5rem;
  background: #424851;
  height: 2rem
  border-radius 0.4rem;
  padding-left: 0.6rem
  border: none
}

.form-select {
  height: 2rem
  border-radius 0.4rem;
  border: none
  padding-left: 0.6rem
  width 6.4rem;
  background: #424851 url("../../../assets/icon/down.png") @width - 1.25rem 0.6rem / 0.8rem 0.8rem no-repeat;
  appearance: none;
  color #fff;
}

.form-select-big-size {
  width: 17.75rem
  background: #424851 url("../../../assets/icon/down.png") @width - 1.25rem 0.6rem / 0.8rem 0.8rem no-repeat;
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
          <input class="form-input" v-model="serviceUrl" style="width: 19.5rem">
        </div>
        <div class="submit-button" @click="checkIp">保存</div>
      </form>
    </div>
    <div class="ss-main-right">
      <h2 class="form-title">当前绑定教室信息</h2>
      <form class="form-content">
        <div class="form-item-inline">
          <div class="form-label">学校名称</div>
          <select class="form-select form-select-big-size" v-model="schoolInfo.school">
            <option v-for="item in selectOption.school" :value="item.id" :label="item.label"></option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-item-inline">
            <div class="form-label">当前校区</div>
            <select class="form-select" v-model="schoolInfo.campus">
              <option v-for="item in selectOption.campus" :value="item.id" :label="item.label"></option>
            </select>
          </div>
          <div class="form-item-inline">
            <div class="form-label">教学楼</div>
            <select class="form-select" v-model="schoolInfo.category">
              <option v-for="item in selectOption.category" :value="item.id" :label="item.label"></option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item-inline">
            <div class="form-label">当前楼层</div>
            <select class="form-select" v-model="schoolInfo.floor">
              <option v-for="item in selectOption.floor" :value="item.id" :label="item.label"></option>
            </select>
          </div>
          <div class="form-item-inline">
            <div class="form-label">当前教室</div>
            <select class="form-select" v-model="schoolInfo.terminal">
              <option v-for="item in selectOption.terminal" :value="item.id" :label="item.label"></option>
            </select>
          </div>
        </div>
        <div class="submit-button">切换绑定</div>
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

export default {
  name: "BindClassroom",
  data() {
    return {
      serviceUrl: '',
      terminals: [],
      schoolInfo: {
        school: '', // 学校
        campus: '', // 校区
        category: '', // 教学楼
        floor: '', // 楼层
        terminal: '' // 教室
      },
      selectOption: {
        school: [],
        campus: [],
        category: [],
        floor: [],
        terminal: []
      }
    }
  },
  created() {
    this.serviceUrl = ls.get('serviceUrl') || '';
  },
  mounted() {
    if(this.serviceUrl) {
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
          console.log(res);
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
    checkIp(){
      ls.set('serviceUrl', this.serviceUrl);
      service.post('classCard/testLink').then(res => {
        if(res.message === 'success') {
          msg({
            message: '连接成功!'
          });
          mitt.emit('refresh');
        }else {
          ls.remove('serviceUrl');
          msg({
            message: '连接服务器失败!'
          });
        }
      })
    }
  }
}
</script>
