<template lang="pug">
  #app
    Nav(v-if="isAuth")
    transition(name="fade" mode="out-in")
      router-view
</template>

<script>
import { mapState } from 'vuex'

// import { requests } from '@/requests'
import Nav from '@/components/Nav.vue'

export default {
  name: 'App',
  computed: mapState([
    'isAuth',
    'isCollapseNav'
  ]),
  components: {
    Nav
  },
  mounted () {
    this.$store.commit('turnAuth', { token: this.$ls.get('Token'), user: this.$ls.get('User') })

    if (!this.isAuth) {
      this.$router.push('login')
    } else {
      this.$store.commit('getLists')
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
  color: #2c3e50;
}
.page {
  padding-left: 270px;
  padding-right: 20px;
  padding-bottom: 100px;
  transition: padding 0.3s ease;

  &.page--wide {
    padding-left: 84px;
  }

  h1 {
    display: inline-block;
    margin: 20px auto;
    font-size: 24px;
    font-weight: normal;

    .el-button {
      margin-left: 20px;
      padding: 7px;
      vertical-align: 3px;
    }
  }
  h3 {
    margin: 30px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

  .green {
    color: #67C23A;
  }
  .red {
    color: red;
  }

  .el-breadcrumb {
    margin-top: 20px;

    .el-breadcrumb__inner {
      &.is-link {
        font-weight: normal;
      }
    }
  }

  .content {
    p {
      margin-bottom: 15px;
    }
  }
}

.el-popover-avatar {
  padding: 0;
}
</style>
