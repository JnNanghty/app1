<style lang="stylus" scoped>
.main
  get_font_color(font_color)
  .title
    text-align center
    margin: 1rem 0
  .keyboard
    width: 50%
    margin: 0 auto
    .password-wrap
      border-top-left-radius 8px
      border-top-right-radius @border-top-left-radius
      display flex
      padding: 1rem;
      .password
        flex: 1
        letter-spacing 1rem;
        display flex
        overflow-x scroll;
        .dot
          width: 10px
          height: @width;
          border-radius 50%;
          background: #424851
          margin-right: 1rem
      .clear-icon
        width: 24px
        height: @width
    .keyboard-content
      display flex
      flex-wrap wrap;
      .number
        flex-grow: 1;
        flex-basis: 33.3%
        padding: 1rem;
        box-sizing border-box
        text-align center
        font-size 1.2rem;
        get_background(open_number_background)
</style>
<template>
  <div class="main">
    <div class="title">密码开门</div>
    <div class="keyboard">
      <div class="password-wrap">
        <div class="password">
          <div v-for="item in password" class="dot"></div>
        </div>
        <div class="clear-icon" @click="clearPassword"><img :src="clearIconSrc" alt=""></div>
      </div>
      <div class="keyboard-content">
        <div class="number" v-for="item in keys" :key="item" @click="addNum(item)">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {msg} from "@/components/message";
import service from "@/api/services";

export default {
  name: "PasswordOpen",
  components: {},
  data() {
    return {
      keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'],
      password: '',
      clearIconSrc: require('@/assets/icon/clear-icon_dark.png'),
      truePassword: ''
    }
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  beforeUnmount() {
  },
  methods: {
    getPassword() {
      service.post('', {}).then()
    },
    addNum(item) {
      if(this.password.length < 6) {
        this.password += item;
      }
    },
    clearPassword() {
      this.password = ''
    },
    checkPassword() {
      if(this.password === this.truePassword) {
        msg({
          message: '密码正确',
          type: 'success'
        })
      } else {
        msg({
          message: '密码错误',
          type: 'wrong'
        });
      }
    }
  }
}
</script>

