<template lang="pug">
  .login
    el-card(shadow="never")
      el-form(:model="loginForm" :rules="rules" status-icon ref="loginForm")
        el-form-item(prop="login")
          el-input(placeholder="Логин" v-model="loginForm.login" autocomplete="off")
        el-form-item(prop="password")
          el-input(placeholder="Пароль" type="password" v-model="loginForm.password" show-password autocomplete="off")
        el-form-item
          el-button(type="success" @click="submitForm('loginForm')") Вход
          center
            p.el-form-item__error {{ serverError }}
</template>

<script>
import { firstRequest } from '@/requests'

export default {
  name: 'Login',
  data: () => ({
    loginForm: {
      login: '',
      password: ''
    },
    serverError: '',
    rules: {
      login: [
        { required: true, message: 'Поле не может быть пустым!', trigger: 'blur' }
      ],
      password: [
        { required: true, message: 'Поле не может быть пустым!', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          firstRequest.post('user/authenticate/', this[formName])
            .then(response => {
              this.$store.commit('turnAuth', { token: response.data.token, user: response.data.data })

              this.$ls.set('Token', response.data.token)
              this.$ls.set('User', response.data.data)

              this.$store.commit('getLists')

              this.$router.push('/')
            })
            .catch(error => {
              this.serverError = error.response.data.data
              this.$refs[formName].resetFields()
            })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  .el-form-item__content {
    .el-form-item__error {
      position: relative;
      top: 5px;
    }
  }

  .el-card {
    width: 400px;
    margin-bottom: 200px;
    text-align: center;
  }
}
</style>
