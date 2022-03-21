<style lang="stylus" scoped>
.main
  get_font_color(font_color)

  .submit-form
    text-align center
    margin-top: 5rem

    .form-item
      margin: 20px 0;
      font-size 20px;

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
  },
  mounted() {
  },
  beforeUnmount() {
  },
  methods: {
    auth() {
      if (this.account === 'admin' &&
          this.password === 'admin') {
        const serviceUrl = ls.get('serviceUrl')
        let name = 'FirstSetting'
        if (serviceUrl) {
          name = 'Auth'
        }
        this.$router.push({
          name: name
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

