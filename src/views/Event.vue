<template lang="pug">
  .page(:class="{'page--wide': isCollapseNav}")
    .event
      el-breadcrumb(separator="/")
        el-breadcrumb-item(:to="{ path: '/' }")
          i.el-icon-s-home
        el-breadcrumb-item(:to="{ path: '/events' }") Мероприятия
        el-breadcrumb-item
      h1 {{ event.title }}
        el-button(type="success" icon="el-icon-edit-outline" circle @click="isOpenEventDialog = true")
        el-button(type="warning" icon="el-icon-refresh" circle @click="getEvent()" round)
        el-button(type="primary" @click="turnTaskEditVisible" round) Создать задачу
        el-button(v-if="!event.is_created_task_templates" @click="setDefaultTasks()" round) Создать типовые задачи

      EventDialog(:sync="isOpenEventDialog" @sync="isOpenEventDialog = $event" @save="event = $event" :data="event")

      el-dialog(title="Редактировать задачу" :visible.sync="isTaskEditVisible")
        el-form(:model="task" label-position="top")
          el-form-item(label="Название:")
            el-input(v-model="task.title")
          el-form-item(label="Бюджет")
            el-input(v-model="task.price")
          el-form-item(label="Описание:")
            el-input(v-model="task.description" type="textarea" :autosize="{ minRows: 5, maxRows: 10}")
        span.dialog-footer(slot="footer")
          el-button(@click="turnTaskEditVisible($event, 'cancel')") Отмена
          el-button(@click="turnTaskEditVisible($event, 'save')" type="success") Сохранить

      el-tabs
        el-tab-pane.el-tab--columns(label="Основная информация")
          .el-tab__sidebar
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
            .el-tab__sidebar__block
              h3 Осталось билетов:
              p {{ event.tickets_count }}

          .el-tab__main
            h2 Описание:
            render-html.content(:code="event.description")

        el-tab-pane.event__tasks(label="Задачи")
          el-table(:data="tasks")
            el-table-column(type="expand")
              template(slot-scope="props")
                p {{ props.row.description }}
                h3 Заявки:
                .event__tasks__applications
                  el-card(:class="{selected: app.selected}" v-for="app in props.row.applications_obj")
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
                      p
                        b Бюджет:
                        span {{ app.price }}
                      br
                      p {{ app.description }}

            el-table-column(label="Название" prop="title" width="500")
            el-table-column(label="Дедлайн" prop="finished_at")
              template(slot-scope="scope")
                span(v-text="formatDateTime(scope.row.started_at)")
            el-table-column(label="Бюджет" prop="price")
            el-table-column(label="Есть заявки" prop="applications" align="center")
              template(slot-scope="scope")
                i.el-icon-document(v-if="scope.row.applications.length")
            el-table-column(label="Выбран исполнитель" prop="selected" align="center")
              template(slot-scope="scope")
                i.el-icon-success.green(v-if="scope.row.applications_obj && scope.row.applications_obj.reduce((res, i) => i.selected || res, false)")
            el-table-column(label="Завершено" prop="completed" align="center")
              template(slot-scope="scope")
                i.el-icon-success.green(v-if="scope.row.completed")

        el-tab-pane(:label="'Участники' + ((parts_count) ? ' (' + parts_count + ')' : '')")
          el-table(:data="parts")
            el-table-column(label="Имя" prop="name" width="500")
            el-table-column(label="Дата регистрации на событие" prop="created_at")
              template(slot-scope="scope")
                span(v-text="formatDateTime(scope.row.created_at)")

        el-tab-pane(:label="'Посетители' + ((visitors_count) ? ' (' + visitors_count + ')' : '')")
          el-table(:data="visitors")
            el-table-column(label="Имя" prop="name" width="500")
            el-table-column(label="Дата покупки билета" prop="created_at")
              template(slot-scope="scope")
                span(v-text="formatDateTime(scope.row.created_at)")
            el-table-column(label="Оплата" prop="is_paid" align="center")
              template(slot-scope="scope")
                i.el-icon-success.green(v-if="scope.row.is_paid")

        el-tab-pane.event__tasks(label="Маркетинг")

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
  name: 'Event',
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
    this.getEvent()
  },
  computed: mapState([
    'isAuth',
    'isCollapseNav',
    'sportTypes',
    'eventPlaces'
  ]),
  data: () => ({
    isTaskEditVisible: false,
    taskEditPrevios: {},
    isOpenEventDialog: false,
    loading: true,
    sport_types: [
      { label: 'Футбол', value: 1 },
      { label: 'Волейбол', value: 2 },
      { label: 'Хоккей', value: 3 },
      { label: 'Дзюдо', value: 4 }
    ],
    places: [
      { label: 'Стадион г. Казань', value: 1 },
      { label: 'ДДЮТ', value: 2 },
      { label: 'Бассейн №3', value: 3 }
    ],
    sport_type: [],
    event_place: 0,
    task: {
      title: '',
      description: '',
      price: 0
    },
    tasks: [],
    parts_count: 0,
    parts: [],
    visitors_count: 0,
    visitors: [],
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
    formatAppData (inputData) {
      const data = JSON.parse(JSON.stringify(inputData))
      delete data.profile

      return data
    },
    selectApp (app, task) {
      const curSelected = app.selected
      task.applications_obj.forEach(item => {
        if (item.id !== app.id) {
          item.selected = false
          requests.patch(`application/${item.id}/`, this.formatAppData(item))
        }
      })
      app.selected = !curSelected
      requests.patch(`application/${app.id}/`, this.formatAppData(app))
      this.getTasks()
    },
    getEvent () {
      const vm = this
      const eventId = this.$route.params.eventId

      requests.get(`event/${eventId}`)
        .then(response => {
          vm.event = response.data
          vm.getTasks()
          vm.getParts()
          vm.getVisitors()
        })
    },
    getTasks () {
      requests.get('task/?event=' + this.event.id)
        .then(response => {
          this.tasks = response.data
        })
    },
    getParts () {
      requests.get(`event/${this.event.id}/participant/`)
        .then(response => {
          this.parts_count = response.data.count
          this.parts = response.data.data
        })
    },
    getVisitors () {
      requests.get(`event/${this.event.id}/visitor/`)
        .then(response => {
          this.visitors_count = response.data.count
          this.visitors = response.data.data
        })
    },
    setDefaultTasks () {
      requests.get(`event/${this.event.id}/create_tasks_template/`)
        .then(response => {
          this.getTasks()
        })
    },
    formatDateTime (datetime) {
      return formatDateTime(datetime, 'datetime', true)
    },
    getListFromObject (obj, field) {
      return obj.map((item, i) => { return item[field] })
    },
    formatTaskData (inputData) {
      const data = JSON.parse(JSON.stringify(inputData))
      data.event = this.event.id

      return data
    },
    turnTaskEditVisible (e, type = 'open') {
      const vm = this
      const saveMethod = (this.task.id) ? 'patch' : 'post'
      const taskId = (saveMethod === 'patch') ? this.task.id + '/' : ''

      switch (type) {
        case 'open':
          (Object.keys(this.taskEditPrevios).length) || (this.taskEditPrevios = JSON.parse(JSON.stringify(this.task)))
          break
        case 'cancel':
          this.task = JSON.parse(JSON.stringify(this.taskEditPrevios))
          this.taskEditPrevios = {}
          break
        case 'save':
          requests[saveMethod](`task/${taskId}`, this.formatTaskData(this.task))
            .then(response => {
              vm.getTasks()
            })
          this.taskEditPrevios = {}
          break
      }

      this.isTaskEditVisible = !this.isTaskEditVisible
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

  .event__tasks__applications {
    display: flex;
    justify-content: start;
    margin: 20px 0;

    .el-card {
      width: 30%;
      margin-left: calc((100% - 32%*3)/2);

      &.selected {
        background-color: #5daf3499;
      }

      &:first-child {
        margin-left: 0;
      }

      .el-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;

        > span {
          margin-right: 10px;
        }
      }

      .el-card__body {
        p {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
