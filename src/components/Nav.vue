<template lang="pug">
  el-menu.el-menu-vertical(
      :collapse="isCollapseNav"
      :router="true"
    )
    el-popover(popper-class="el-popover-avatar" placement="right" width="auto" v-model="isUserMenu")
      el-menu.el-menu-popover
        el-menu-item(@click="isUserMenu = false")
          i.el-icon-user
          span(slot="title") Личный кабинет
        el-menu-item(@click="logout")
          i.el-icon-sunset
          span(slot="title") Выход
      .el-menu__avatar(slot="reference" :class="{'el-menu__avatar--close': isCollapseNav}")
        el-avatar.el-menu__avatar__icon(icon="el-icon-user-solid" :src="user.avatar")
        span.el-menu__avatar__name(ref="avatar_name") {{ user.name }}
    el-menu-item(index="/events")
        i.el-icon-basketball
        span(slot="title") Мероприятия
    el-menu-item(index="/tasks")
        i.el-icon-guide
        span(slot="title") Задачи
    el-menu-item(index="/event_places")
      i.el-icon-map-location
      span(slot="title") Площадки

    i.el-menu__turn(@click="turnCollapse" :class="{'el-icon-arrow-right': isCollapseNav, 'el-icon-arrow-left': !isCollapseNav}")
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Nav',
  data: () => ({
    isUserMenu: false
  }),
  computed: mapState([
    'isAuth',
    'isCollapseNav',
    'user'
  ]),
  methods: {
    handleSelect (event) {
      console.log(event)
    },
    turnCollapse () {
      this.$store.commit('turnCollapseNav')
    },
    logout () {
      this.$ls.remove('Token')
      this.$ls.remove('User')

      this.isUserMenu = false
      this.$store.commit('turnAuth', '', {})
      this.$router.push('login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.el-menu-vertical {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  min-height: 400px;
  background-color: #409eff17;

  &:not(.el-menu--collapse) {
    width: 250px;
  }

  .el-menu-item {
    height: 45px;
    line-height: 45px;

    i {
      margin-right: 18px;
    }
  }

  a {
    text-decoration: none;
  }
}
.el-menu__avatar {
  display: flex;
  align-items: center;
  height: 80px;
  margin-bottom: 10px;
  padding: 20px 12px;
  border-bottom: 1px solid #dcdfe6;
  white-space: nowrap;
  cursor: pointer;

  &.el-menu__avatar--close {
    .el-menu__avatar__name {
      display: none;
    }
  }

  .el-menu__avatar__icon {
    flex: none;
    margin-right: 10px;
  }

  .el-menu__avatar__name {
    font-size: 13px;
    white-space: normal;
  }
}
.el-menu-popover {
  border: 0;

  .el-menu-item {
    height: 40px;
    padding: 0 15px !important;;
    line-height: 40px;

    i {
      margin-right: 10px;
    }
  }
}
.el-menu__turn {
  position: absolute;
  bottom: 30px;
  right: -14px;
  padding: 3px;
  background: #fff;
  border: 1px solid #409eff;
  border-radius: 50%;
  font-size: 20px;
  color: #409eff;
  cursor: pointer;
}
</style>
