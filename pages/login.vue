<template>
  <div class="container">
    <div>
      <h1 class="subtitle">Please sign</h1>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="Username:">
          <el-input v-model="form.username" @keyup="bonSubmit"></el-input>
        </el-form-item>
        <el-form-item label="Password:">
          <el-input
            type="password"
            v-model="form.password"
            @keyup="bonSubmit"
          ></el-input>
        </el-form-item>
        <el-alert
          v-if="error_msg && error_msg.length > 0"
          v-bind:title="error_msg"
          type="error"
          center
          show-icon
        >
        </el-alert>
        <el-alert
          v-if="success_msg && success_msg.length > 0"
          v-bind:title="success_msg || !isLoggingIn"
          type="success"
          center
          show-icon
        >
        </el-alert>
        <br />
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-key"
            :loading="isLoggingIn"
            @click="onSubmit"
            >Sign</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
let this_user = undefined
import { Helper } from '../utils/Helper'
let helper = new Helper()
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      error_msg: '',
      success_msg: '',
      isLoggingIn: false,
    }
  },
  created() {
    if (this.$cookies.get('auth')) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    bonSubmit(e) {
      console.log(e)
      if (e.keyCode === 13) {
        this.onSubmit()
      }
    },
    onSubmit() {
      let _this = this
      if (
        this.form.password.length < 1 ||
        this.form.username.length < 1 ||
        this.isLoggingIn
      )
        return (this.error_msg = 'Please input username and password!')
      this.error_msg = ''
      this.isLoggingIn = true
      this.success_msg = 'Signing in...'
      this_user = undefined
      this.$axios
        .post(helper.ENDPOINT_URL + '/account/auth', this.form)
        .then(function (response) {
          console.log(response)
          if (response.data.success) {
            _this.error_msg = ''
            _this.success_msg = 'Sign in success!'
            _this.isLoggingIn = false
            this_user = response.data.user
            _this.$cookies.set('auth', response.data.content, '1d')
            _this.$cookies.set('username', _this.form.username, '1d')
            _this.$router.push('/dashboard')
          } else {
            _this.error_msg = response.data.msg
            _this.success_msg = ''
            _this.isLoggingIn = false
          }
        })
        .catch(function (error) {
          console.log(error)
          _this.success_msg = ''
          _this.error_msg = 'Sign in failed!'
          _this.isLoggingIn = false
        })
    },
  },
  head() {
    return {
      title: 'Sign',
    }
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow-y: hidden;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.el-loading-mask {
  cursor: wait;
}
html {
  overflow: hidden;
}
</style>
