<style scoped lang="stylus">
.cs-warp
  get_background(borrow_wrap_background)
  border-radius .4rem
  width: 100%
  height: 100%
  padding: 1rem 1.5rem;
  box-sizing border-box

.cs-select
  display flex
  margin-bottom: .5rem

  .select-item
    margin-right: .75rem

.cs-content
  overflow-y scroll
  margin-top: .5rem
  display flex
  flex-wrap wrap
  .terminal-item
    font-size .6rem
    white-space nowrap
    text-overflow ellipsis
    overflow: hidden;
    width: 4.5rem
    margin: 5px
    get_background(input_background)
    border-radius 8px
    padding: .5rem;
</style>
<template>
  <div class="cs-warp">
    <div class="cs-select">
      <select class="select-item _select" v-model="campusId" @change="selectCampus">
        <option value="-1" label="选择校区"></option>
        <option v-for="item in campus" :key="item.id" :value="item.id" :label="item.label"></option>
      </select>
      <select class="_select" v-model="buildingId">
        <option value="-1" label="选择教学楼"></option>
        <option v-for="item in building" :key="item.id" :value="item.id" :label="item.label"></option>
      </select>
    </div>
    <span style="font-size: .6rem;opacity: 0.5;font-weight: 200;">全部教室</span>
    <div class="cs-content">
      <div class="terminal-item" v-for="item in terminal" :key="item.id" @click="selectTerminal(item)">
        {{item.label}}
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/services";
import mitt from "@/util/mitt";

export default {
  name: "ClassroomSelect",
  data() {
    return {
      campus: [], // 校区
      campusId: -1,
      buildingId: -1,
      terminalId: -1
    }
  },
  computed: {
    building() {
      let b = []
      this.campus.forEach(i => i.id === this.campusId && (b = i.children));
      return b;
    },
    terminal() {
      let t = [], r = []
      this.building.forEach(i => i.id === this.buildingId && (t = i.children))
      console.log(t)
      t.forEach(i => {
        i.children.forEach(j => {
          r.push(j)
        })
      })
      return r;
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
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
                      "label": "101-金智",
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
    },
    selectTerminal(item) {
      this.terminalId = item.id;
      mitt.emit('updateSelect', item);
    }
  }
}
</script>

