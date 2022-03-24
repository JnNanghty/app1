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
}

.form-label {
  margin-bottom: 0.35rem
  font-size 0.7rem;
}

.form-input {
  max-width: 19.5rem;
  height: 2rem
}

.form-select {
  height: 2rem
  //width 6.4rem;
  width: 17rem;
}

.form-select-big-size {
  width: 17.75rem

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
        <div class="submit-button _button" @click="checkIp">保存</div>
      </form>
    </div>
    <div class="ss-main-right">
      <h2 class="form-title">当前绑定教室信息</h2>
      <form class="form-content">
<!--        <div class="form-item-inline">-->
<!--          <div class="form-label">学校名称</div>-->
<!--          <select class="form-select _select form-select-big-size" v-model="schoolInfo.school">-->
<!--            <option v-for="item in campus" :value="item.id" :label="item.label"></option>-->
<!--          </select>-->
<!--        </div>-->
<!--        <div class="form-row">-->
          <div class="form-item-inline">
            <div class="form-label">当前校区</div>
            <select class="form-select _select" v-model="schoolInfo.campus">
              <option v-for="item in campus" :value="item.id" :label="item.label"></option>
            </select>
          </div>
          <div class="form-item-inline">
            <div class="form-label">教学楼</div>
            <select class="form-select _select" v-model="schoolInfo.category">
              <option v-for="item in category" :value="item.id" :label="item.label"></option>
            </select>
          </div>
<!--        </div>-->
<!--        <div class="form-row">-->
          <div class="form-item-inline">
            <div class="form-label">当前楼层</div>
            <select class="form-select _select" v-model="schoolInfo.floor">
              <option v-for="item in floor" :value="item.id" :label="item.label"></option>
            </select>
          </div>
          <div class="form-item-inline">
            <div class="form-label">当前教室</div>
            <select class="form-select _select" v-model="schoolInfo.terminal">
              <option v-for="item in terminal" :value="item.id" :label="item.label"></option>
            </select>
          </div>
<!--        </div>-->
        <div class="submit-button _button" @click="bind">切换绑定</div>
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
    let mac = 'zzzz'
    if (window.device) {
      mac = window.device.uuid;
    }
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
      campus: [],
      mac,
      message: '',
      terminalId: null
    }
  },
  created() {
    this.serviceUrl = ls.get('serviceUrl') || '';
    this.terminalId = ls.get('terminalId')
  },
  computed: {
    category() {
      let r = []
      this.campus.some(i => i.id === this.schoolInfo.campus && (r = i.children))
      return r
    },
    floor() {
      let r = []
      this.category.some(i => i.id === this.schoolInfo.category && (r = i.children))
      return r
    },
    terminal() {
      let r = []
      this.floor.some(i => i.id === this.schoolInfo.floor && (r = i.children))
      return r
    }
  },
  mounted() {
    if (this.serviceUrl) {
      this.getTerminal();
      // this.getSchool();
    }
  },
  methods: {
    // 查教室树
    getTerminal() {
      this.campus = [
        {
          "parent": null,
          "children": [
            {
              "parent": {
                "id": 6669935,
                "label": "杭州校区"
              },
              "children": [
                {
                  "parent": {
                    "id": 6669941,
                    "label": "行政楼"
                  },
                  "children": [
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 6669946,
                      "label": "101-金智（会议室1800壁挂机）",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 6669949,
                      "label": "103-云智（样板间后墙飞机头）",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 6669954,
                      "label": "102-睿智（样板间前墙飞机头）",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669944,
                        "label": "1L"
                      },
                      "id": 10123262,
                      "label": "测试",
                      "$type": "terminal"
                    }
                  ],
                  "$more": false,
                  "id": 6669944,
                  "label": "1L",
                  "$type": "terminalCategory"
                }
              ],
              "$more": false,
              "id": 6669941,
              "label": "行政楼",
              "$type": "terminalCategory"
            },
            {
              "parent": {
                "id": 6669935,
                "label": "杭州校区"
              },
              "children": [
                {
                  "parent": {
                    "id": 6669983,
                    "label": "4号楼"
                  },
                  "children": [
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 6669999,
                      "label": "101-报告厅拼接屏",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 6670003,
                      "label": "102-大风实验室",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 10220449,
                      "label": "103-阶梯教室展示区",
                      "$type": "terminal"
                    },
                    {
                      "parent": {
                        "id": 6669991,
                        "label": "1L"
                      },
                      "id": 10220451,
                      "label": "104-功能教室展示区（融合屏）",
                      "$type": "terminal"
                    }
                  ],
                  "$more": false,
                  "id": 6669991,
                  "label": "1L",
                  "$type": "terminalCategory"
                }
              ],
              "$more": false,
              "id": 6669983,
              "label": "4号楼",
              "$type": "terminalCategory"
            }
          ],
          "$more": false,
          "id": 6669935,
          "label": "杭州校区",
          "$type": "terminalCategory",
          "$hasChildren": true
        }
      ]
      if(this.terminalId) {
        this.setCurrentTerminal();
      }
    },
    // 检查连接
    checkIp() {
      ls.set('serviceUrl', this.serviceUrl);
      msg({
        message: '连接成功!',
        type: 'success'
      });
      this.getTerminal();
      initMqtt();
    },
    bind() {
      const terminalId = ls.get('terminalId');
      if (terminalId) {
        this.changeBind()
      } else {
        this.bindTerminal()
      }
    },
    // 绑定教室
    bindTerminal() {
      ls.set('companyId', 6669210);
      ls.set('terminalId', this.schoolInfo.terminal);

    },
    changeBind() {
      ls.set('terminalId', this.schoolInfo.terminal);
      msg({
        message: '绑定成功！',
        type: 'success'
      });
    },
    setCurrentTerminal() {
      // 根据当前的terminalId 找出对应的楼层教学楼校区等.
      this.campus.forEach(cam => {
        cam.children.forEach(cat => {
          cat.children.forEach(flo => {
            flo.children.forEach(ter => {
              if(ter.id === this.terminalId) {
                this.schoolInfo.campus = cam.id;
                this.schoolInfo.category = cat.id;
                this.schoolInfo.floor = flo.id;
                this.schoolInfo.terminal = ter.id;
              }
            })
          })
        })
      })
    }
  }
}
</script>
