<template lang="pug">
  .page(:class="{'page--wide': isCollapseNav}")
    .event
      el-breadcrumb(separator="/")
        el-breadcrumb-item(:to="{ path: '/' }")
          i.el-icon-s-home
        el-breadcrumb-item(:to="{ path: '/tasks' }") Задачи
        el-breadcrumb-item
      h1 {{ task.title }}
        el-button(type="primary" v-if="!app.id" @click="turnAppEditVisible" round) Отправить заявку

      el-dialog(title="Отправить заявку" :visible.sync="isAppEditVisible")
        el-form(:model="app" label-position="top")
          el-form-item(label="Предлагаемый бюджет:")
            el-input(v-model="app.price")
          el-form-item(label="Описание:")
            el-input(v-model="app.description" type="textarea" :autosize="{ minRows: 5, maxRows: 10}")
        span.dialog-footer(slot="footer")
          el-button(@click="turnAppEditVisible($event, 'cancel')") Отмена
          el-button(@click="turnAppEditVisible($event, 'save')" type="success") Сохранить

      el-tabs(v-model="tabIndex")
        el-tab-pane.el-tab--columns(label="Основная информация")
          .el-tab__sidebar
            .el-tab__sidebar__block
              p(v-text="event.title")
            br
            el-image(
                :src="event.photo"
                @load="loading = false"
                @error="loading = false"
                v-loading="loading"
                fit="cover"
              )
              .image-slot(slot="placeholder")
              .image-slot(slot="error")
                i.el-icon-picture-outline
            .el-tab__sidebar__block
              h3 Дата проведения:
              p(v-text="formatDateTime(event.started_at)")
            .el-tab__sidebar__block
              h3 Место проведения:
              p(v-text="event.event_place_obj.title")
            .el-tab__sidebar__block
              h3 Виды спорта:
              p
                el-tag(v-for="title in getListFromObject(event.sport_types_obj, 'title')") {{ title }}

          .el-tab__main
            h2 Описание задачи:
            render-html.content(:code="task.description")

        el-tab-pane.task__app(label="Заявка" v-if="app.id")

          el-card(:class="{selected: app.selected}")
            template(slot="header")
              span(v-text="formatDateTime(app.created_at)")
              el-button(type="danger" size="small" @click="cancelApp(app)") Отменить
            div
              p
                b Бюджет:
                span  {{ app.price }}
              br
              p {{ app.description }}

          div
            h3 Комментарии:
        //--el-tab-pane.event__tasks(label="Задачи")
          el-table(:data="tasks")
            el-table-column(type="expand")
              template(slot-scope="props")
                p {{ props.row.description }}
                h3 Заявки:
                .event__tasks__applications
                  el-card(:class="{selected: app.selected}" v-for="app in props.row.applications")
                    template(slot="header")
                      el-avatar.el-menu__avatar__icon(icon="el-icon-user-solid" :src="app.profile.avatar")
                      span {{ app.profile.name }}
                      el-button(style="margin-left: auto;" size="small") К профилю
                      el-button(
                          :type="(app.selected) ? 'danger' : 'success'"
                          size="small"
                          v-text="(app.selected) ? 'Отменить' : 'Принять'"
                          @click="selectApp(app, props.row)"
                        )
                    div
                      p {{ app.description }}

            el-table-column(label="Цель" prop="title")
            el-table-column(label="Бюджет" prop="price")
            el-table-column(label="Дедлайн" prop="finished_at")
  </el-tabs>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import { formatDateTime } from '@/other'
import EventDialog from '@/components/EventDialog'

import { defaultRequest } from '@/requests'
const requests = (localStorage.getItem('serp__Token')) ? defaultRequest(JSON.parse(localStorage.getItem('serp__Token')).value) : ''

export default {
  name: 'Task',
  components: {
    'render-html': Vue.component('render-html', {
      props: ['code'],
      render (h) {
        return h('div', {
          domProps: {
            innerHTML: this.code.replace('script', '')
          }
        })
      }
    }),
    EventDialog
  },
  mounted () {
    this.getTask()
  },
  computed: mapState([
    'isAuth',
    'user',
    'isCollapseNav',
    'sportTypes',
    'eventPlaces'
  ]),
  data: () => ({
    tabIndex: '0',
    isTaskEditVisible: false,
    taskEditPrevios: {},
    isAppEditVisible: false,
    appEditPrevios: {},
    isOpenEventDialog: false,
    loading: true,
    sport_type: [],
    event_place: 0,
    app: {
      price: 0,
      description: '',
      profile: undefined,
      task: undefined
    },
    task: {
      title: '',
      description: '',
      price: 0
    },
    event: {
      title: '',
      photo: '',
      description: '',
      started_at: undefined,
      event_place: undefined,
      event_place_obj: {},
      sport_types: [],
      sport_types_obj: [],
      is_active: false
    }
  }),
  methods: {
    cancelApp (app) {
      const vm = this

      requests.delete(`application/${app.id}`)
        .then(response => {
          vm.getTask()
          vm.tabIndex = '0'
        })
    },
    getTask () {
      const vm = this
      const taskId = this.$route.params.taskId

      requests.get(`task/${taskId}`)
        .then(response => {
          vm.task = response.data

          vm.getEvent()
          vm.getApp()
        })
    },
    getEvent () {
      const vm = this
      const eventId = this.task.event

      requests.get(`event/${eventId}`)
        .then(response => {
          vm.event = response.data
        })
    },
    getApp () {
      const appList = this.task.applications_obj.filter(item => item.profile.id === this.user.id)
      if (appList.length) {
        this.app = appList[0]
      } else {
        this.app = {
          price: 0,
          description: '',
          profile: undefined,
          task: undefined
        }
      }
    },
    formatDateTime (datetime) {
      return formatDateTime(datetime, 'datetime', true)
    },
    getListFromObject (obj, field) {
      return obj.map((item, i) => { return item[field] })
    },
    formatAppData (inputData) {
      const data = JSON.parse(JSON.stringify(inputData))
      data.profile = this.user.id
      data.task = this.task.id

      return data
    },
    turnAppEditVisible (e, type = 'open') {
      const vm = this
      const saveMethod = (this.app.id) ? 'patch' : 'post'
      const appId = (saveMethod === 'patch') ? this.app.id + '/' : ''

      switch (type) {
        case 'open':
          (Object.keys(this.appEditPrevios).length) || (this.appEditPrevios = JSON.parse(JSON.stringify(this.app)))
          break
        case 'cancel':
          this.app = JSON.parse(JSON.stringify(this.appEditPrevios))
          this.appEditPrevios = {}
          break
        case 'save':
          requests[saveMethod](`application/${appId}`, this.formatAppData(this.app))
            .then(response => {
              vm.app = response.data
            })
          this.appEditPrevios = {}
          break
      }

      this.isAppEditVisible = !this.isAppEditVisible
    }
  }
}
</script>

<style lang="less">
.el-dialog__body {
  padding: 10px 20px 30px;
}
.event {
  h2 {
    margin-bottom: 15px;
  }
  .el-tab--columns {
    display: flex;
    justify-content: space-between;

    .el-tab__sidebar {
      width: 20%;

      .el-tab__sidebar__block {
        h3 {
          margin-bottom: 10px;
        }
        p {
          font-size: 18px;

          .el-tag {
            margin-right: 10px;
          }
        }
      }
    }
    .el-tab__main {
      width: 78%;
    }
  }
  .el-image {
    width: 100%;
    height: 250px;

    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      border: 1px solid #dcdfe6;

      .el-icon-picture-outline {
        font-size: 40px;
        color: #dcdfe6;
      }
    }
  }
}
.task__app {
  .el-card {
    width: 60%;

    .el-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
    }
  }
}
</style>
