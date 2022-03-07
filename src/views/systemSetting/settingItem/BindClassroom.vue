<style scoped lang="stylus">
.ss-main-content {
  display: flex;
  color #fff;
  height: 100%;
  width: 100%

  .ss-main-left {
    margin-right: 13px
  }

  .ss-main-left,
  .ss-main-right {
    flex: 1;
    background: rgba(66, 72, 81, 0.25);
    border-radius 7px;
    padding-top: 14px
    padding-left: 25px
    position relative
  }
}

.form-content {
  margin-left: 11px
}

.form-title {
  margin-bottom: 23px
}

.form-row {
  display flex;

  .form-item-inline {
    flex: 1
  }
}

.form-item {
  margin-bottom: 17px
}

.form-item-inline {
  margin-bottom: 26px
  display flex;

  .form-label{
    width 50px;
    white-space nowrap;
    margin-right: 13px
    line-height 40px;
    text-align right
  }
}

.form-label {
  margin-bottom: 7px
  font-size 14px;
}

.form-input {
  background: #424851;
  max-width: 390px;
  border-radius 8px;
  height: 40px
  padding-left: 12px
  border: none
}

.form-select {
  border-radius 8px;
  height: 40px
  border: none
  padding-left: 12px
  width 128px;
  background: #424851 url("../../../assets/icon/down.png") @width - 25px 12px / 16px 16px no-repeat;
  appearance: none;
  color #fff;
}

.form-select-big-size {
  width: 355px
  background: #424851 url("../../../assets/icon/down.png") @width - 25px 12px / 16px 16px no-repeat;
}

.submit-button {
  text-align center;
  background-color: #FDA45E;
  border-radius 8px;
  width: 310px
  height: 40px
  line-height @height;
  bottom: 17px
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
          <input class="form-input" style="width: 390px">
        </div>
        <div class="submit-button">保存</div>
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

export default {
  name: "BindClassroom",
  data() {
    return {
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
          this.terminals = this.initData(res.list);
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
  }
}
</script>
