<template lang="pug">
  #app
    transition(name="fade" mode="out-in")
      router-view
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: mapState([
    'is_auth'
  ]),
  mounted () {
    if (!this.turn_auth) {
      this.$router.push('login')
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
  font-size: inherit;
  color: inherit;
  outline: none;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
