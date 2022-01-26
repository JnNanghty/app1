<style scoped>
.wrapper {
  width: fit-content;
  height: fit-content;
  padding: 20px;
  margin: 20% auto 0;
}
</style>
<template>
  <van-overlay :show="visible" @click="visible = false">
    <div class="wrapper" @click.stop>
      <van-cell-group inset>
        <!-- 输入任意文本 -->
        <van-field v-model="account" label="账号" />
        <van-field v-model="password" type="password" label="密码" />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block @click="submit" type="primary">确认</van-button>
      </div>
    </div>
  </van-overlay>
</template>

<script>
import service from "@/api/services";
import {setToken} from "@/util/auth";
import ls from "@/store/ls";
import {msg} from "@/components/message";

export default {
  name: 'PasswordLogin',
  emits: ['loginSuccess'],
  data() {
    return {
      visible: false,
      account: '',
      password: ''
    };
  },
  created() {
  },
  methods: {
    submit() {
      service.post('auth/login', {
        account: this.account,
        password: this.password
      }).then(res => {
        setToken(res.token);
        ls.set('userInfo', res, 6e5);
        this.$emit('loginSuccess');
        msg({
          message: '登录成功！'
        });
        this.visible = false;
      }, () => {
        msg({
          message: '登录失败！'
        });
        this.visible = false;
      })
    }
  }
};
</script>

