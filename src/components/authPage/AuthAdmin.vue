<style lang="stylus" scoped>
.main
  get_font_color(font_color)

  .submit-form
    text-align center
    margin-top: 5rem

    .form-item
      margin: 1rem 0;
      font-size 1rem;

      .form-input
        height: 2rem

    .submit
      width: 30%
      margin-top: 3rem
</style>
<template>
  <div class="main">
    <form class="submit-form">
      <div class="form-item">
        <label for="account">
          管理账号：
          <input type="text" v-model="account" class="form-input _input" id="account">
        </label>
      </div>
      <div class="form-item">
        <label for="password">
          管理密码：
          <input type="password" v-model="password" class="form-input _input" id="password">
        </label>
      </div>
      <div class="submit _button" @click="auth">确认</div>
    </form>
  </div>
</template>

<script>
// 验证是否是管理员
import {msg} from "@/components/message";
import ls from "@/store/ls";
import mitt from "@/util/mitt";

export default {
  name: "AuthAdmin",
  components: {},
  data() {
    return {
      account: '',
      password: ''
    }
  },
  computed: {},
  created() {
    mitt.emit('showBackButton', () => {
      this.$router.push({
        name: 'Home'
      });
    })
  },
  mounted() {
  },
  beforeUnmount() {
    mitt.emit('hideBackButton')
  },
  methods: {
    auth() {
      if (this.account === 'admin' &&
          this.password === 'admin') {
        const companyId = ls.get('companyId')
        let name = 'FirstSetting'
        if (companyId) {
          name = 'Auth'
        }
        this.$router.push({
          name: name,
          params: {
            showChangeLoginModeButton: true
          }
        });
      } else {
        msg({
          message: '账号或密码错误',
          type: 'wrong'
        })
      }
    }
  }
}
</script>

