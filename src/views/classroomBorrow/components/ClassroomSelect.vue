<style scoped lang="stylus">
.cs-warp
  get_background(borrow_wrap_background)
  border-radius 8px
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
    background: #424851;
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

