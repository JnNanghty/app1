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
    flex: 1;

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
      <my-select class="select-item _select" :len="campus.length" :value="schoolInfo.campus.label">
        <my-option @select="campusSelected" value="-1" label="选择校区"></my-option>
        <my-option @select="campusSelected" v-for="item in campus" :key="item.id" :value="item.id" :label="item.label"></my-option>
      </my-select>
      <my-select class="select-item _select" :len="building.length" :value="schoolInfo.building.label">
        <my-option @select="buildingSelected" value="-1" label="选择教学楼"></my-option>
        <my-option @select="buildingSelected" v-for="item in building" :key="item.id" :value="item.id" :label="item.label"></my-option>
      </my-select>
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
      schoolInfo: {
        campus: {label: '请选择校区', value: -1},
        building: {label: '请选择教学楼', value: -1},
      },
    }
  },
  computed: {
    building() {
      let b = []
      this.campus.forEach(i => i.id === this.schoolInfo.campus.value && (b = i.children));
      return b;
    },
    terminal() {
      let t = [], r = []
      this.building.forEach(i => i.id === this.schoolInfo.building.value && (t = i.children))
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
    campusSelected(item) {
      this.schoolInfo.campus = item;
      this.schoolInfo.building = {label: '请选择教学楼', value: -1}
    },
    buildingSelected(item) {
      this.schoolInfo.building = item;
    },
    getInfo() {
      service.post('model/getEntityTree', {
        nodes: [{
          subnodes: [{
            type: 'terminal',
            filter: {field: 'parent', match: 'EQ', value: null}
          }, {
            type: 'terminalCategory',
            filter: {field: 'parent', match: 'EQ', value: null}
          }]
        }, {
          type: 'terminal'
        }, {
          type: 'terminalCategory',
          subnodes: [{
            type: 'terminal',
            filter: {field: 'parent', match: 'EQ', value: '$parentId'}
          }, {
            type: 'terminalCategory',
            filter: {field: 'parent', match: 'EQ', value: '$parentId'}
          }]
        }]
      }).then(res => {
        this.campus = res.list;
      })
    },
    selectTerminal(item) {
      this.terminalId = item.id;
      mitt.emit('updateSelect', item);
    }
  }
}
</script>

