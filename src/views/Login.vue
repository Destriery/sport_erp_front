<template lang="pug">
  .login
    el-card(shadow="never")
      el-form(:model="loginForm" :rules="rules" status-icon ref="loginForm")
        el-form-item(prop="username")
          el-input(placeholder="Логин" v-model="loginForm.username" autocomplete="off")
        el-form-item(prop="password")
          el-input(placeholder="Пароль" type="password" v-model="loginForm.password" show-password autocomplete="off")
        el-form-item
          el-button(type="success" @click="submitForm('loginForm')") Вход
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    loginForm: {
      username: '',
      password: ''
    },
    rules: {
      username: [
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
          this.$router.push('/')
          this.$store.commit('turn_auth')
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

  .el-card {
    width: 400px;
    margin-bottom: 200px;
  }
}
</style>
