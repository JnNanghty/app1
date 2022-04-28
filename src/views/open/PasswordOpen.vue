<style lang="stylus" scoped>
.main
  get_font_color(font_color)

  .title
    text-align center
    font-size .8rem;

  .keyboard
    width: 13rem;
    margin: 2rem auto 1.5rem;

    .status-wrap
      padding: 2px;
      padding-bottom: 0
      border-top-left-radius .3rem
      border-top-right-radius @border-top-left-radius

    .wrong-status
      background-image linear-gradient(to bottom, #FD5E5E, #FF000000)

    .password-wrap
      border-top-left-radius .3rem
      border-top-right-radius @border-top-left-radius
      display flex
      align-items center
      height: 2.5rem
      box-sizing border-box
      padding: 0 1rem
      line-height @height;
      get_background(open_password_background)

      .password
        flex: 1
        letter-spacing 1rem;
        display flex
        overflow-x scroll;

        .dot
          width: .5rem;
          height: @width;
          border-radius 50%;
          background: #424851
          margin-right: 1rem

      .clear-icon
        width: 1.2rem
        height: @width

        img
          width: 100%
          height 100%
          vertical-align top;

    .keyboard-content
      display flex
      flex-wrap wrap;
      padding: 0 2px;

      .number
        flex-grow: 1;
        flex-basis: 33.3%
        height: 2.5rem
        line-height @height;
        box-sizing border-box
        text-align center
        font-size 1rem;
        border 1px solid #3F3F3F
        get_background(open_number_background)
        get_border_color(open_number_border_color)

.button-wrap
  display flex
  justify-content center
  font-weight 300

  .back-button
    margin: 0 3rem 0 0
    width: 5rem
    position relative
    font-size .7rem;
    get_background(open_button_background)
    box-shadow: -7px -4px 16px -4px rgba(255, 255, 255, 0.08), 10px 10px 13px -2px rgba(0, 0, 0, 0.12);

  .submit-button
    width: 5rem
    margin: 0
    position relative
    font-size .7rem;
    get_background(open_button_background)
    color #F3A568;
    box-shadow: -7px -4px 16px -4px rgba(255, 255, 255, 0.08), 10px 10px 13px -2px rgba(0, 0, 0, 0.12);
</style>
<template>
  <div class="main">
    <div class="title">密码开门</div>
    <div class="keyboard">
      <div class="status-wrap" :class="showWrong ? 'wrong-status' : ''">
        <div class="password-wrap">
          <div class="password">
            <div v-for="item in password" class="dot"></div>
          </div>
          <div class="clear-icon" @click="clearPassword"><img :src="clearIconSrc" alt=""></div>
        </div>
      </div>
      <div class="keyboard-content">
        <div class="number" v-for="item in keys" :key="item" @click="addNum(item)">{{ item }}</div>
      </div>
    </div>
    <div class="button-wrap">
      <div class="back-button _button" @click="backspace">删除</div>
      <div class="submit-button _button" @click="submit">确认</div>
    </div>
  </div>
</template>

<script>
import {msg} from "@/components/message";
import service from "@/api/services";
import mitt from "@/util/mitt";

export default {
  name: "PasswordOpen",
  components: {},
  data() {
    return {
      keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'],
      password: '',
      clearIconSrc: require('@/assets/icon/clear-icon_dark.png'),
      truePassword: '123456',
      showWrong: false
    }
  },
  computed: {},
  created() {
  },
  mounted() {
    mitt.emit('showBackButton');
  },
  beforeUnmount() {
    mitt.emit('hideBackButton');
  },
  methods: {
    getPassword() {
      service.post('', {}).then()
    },
    addNum(item) {
      if (this.password.length < 6) {
        this.password += item;
      }
    },
    clearPassword() {
      this.password = ''
      this.showWrong = false;
    },
    checkPassword() {
      if (this.password === this.truePassword) {
        msg({
          message: '密码正确',
          type: 'success'
        })
        this.showWrong = false;
        this.senCmd();
      } else {
        this.showWrong = true;
        msg({
          message: '密码错误',
          type: 'wrong'
        });
      }
    },
    backspace() {
      this.password = this.password.slice(0, -1)
      this.showWrong = false;
    },
    submit() {
      this.checkPassword();
    },
    senCmd() {
      if (window.serialPortPlugin) {
        let cmd = new Uint8Array([0xAA, 0x02, 0x00, 0x00, 0x55]);
        window.serialPortPlugin.send(cmd, 3);
      }
    }
  }
}
</script>

