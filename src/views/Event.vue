<template lang="pug">
  .page(:class="{'page--wide': isCollapseNav}")
    .event
      el-breadcrumb(separator="/")
        el-breadcrumb-item(:to="{ path: '/' }")
          i.el-icon-s-home
        el-breadcrumb-item(:to="{ path: '/events' }") Мероприятия
        el-breadcrumb-item
      h1 {{ event.title }}
        el-button(type="success" icon="el-icon-edit-outline" circle @click="turnEventEditVisible")
        el-button(type="primary" @click="turnTaskEditVisible" round) Создать задачу
      el-dialog(:title="'Редактировать ' + event.title" :visible.sync="isEventEditVisible")
        el-form(:model="event" label-position="top")
          el-form-item(label="Название:")
            el-input(v-model="event.title")
          el-form-item(label="Даты проведения:")
            el-date-picker(
              v-model="event.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator=" - "
              start-placeholder="Начало"
              end-placeholder="Завершение"
            )
          el-form-item(label="Виды спорта:")
            el-select(
                v-model="event.sport_types"
                filterable
                clearable
                multiple
                placeholder="Вид спорта"
              )
              el-option(v-for="item in sport_types" :key="item.value" :label="item.label" :value="item.value")
          el-form-item(label="Площадка:")
            el-select(
                v-model="event.event_place"
                filterable
                clearable
                placeholder="Площадка"
              )
              el-option(v-for="item in places" :key="item.value" :label="item.label" :value="item.value")

          el-form-item(label="Описание:")
            el-input(v-model="event.description" type="textarea" :autosize="{ minRows: 5, maxRows: 10}")
        span.dialog-footer(slot="footer")
          el-button(@click="turnEventEditVisible($event, 'cancel')") Отмена
          el-button(@click="turnEventEditVisible($event, 'save')" type="success") Сохранить

      el-dialog(title="Редактировать задачу" :visible.sync="isTaskEditVisible")
        el-form(:model="task" label-position="top")
          el-form-item(label="Название:")
            el-input(v-model="task.title")
          el-form-item(label="Название:")
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
              p {{ event.started_at }}
            .el-tab__sidebar__block
              h3 Место проведения:
              p {{ event.event_place_name }}
            .el-tab__sidebar__block
              h3 Виды спорта:
              p
                el-tag(v-for="title in event.sport_types_names.split(', ')") {{ title }}

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
                  el-card(:class="{selected: app.selected}" v-for="app in props.row.applications")
                    template(slot="header")
                      el-avatar.el-menu__avatar__icon(icon="el-icon-user-solid")
                        img(:src="app.profile.avatar" :alt="app.profile.name")
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
    })
  },
  computed: mapState([
    'isAuth',
    'isCollapseNav'
  ]),
  data: () => ({
    isEventEditVisible: false,
    eventEditPrevios: {},
    isTaskEditVisible: false,
    taskEditPrevios: {},
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
    task: {
      title: 'Задача 1',
      description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет. Среди фруктов яблоко является очень распространенным продуктом и практически целый год присутствует в нашем рационе питания. Употребление этих плодов натощак недопустимо при гастритах с повышенной кислотностью, язвенных болезнях, желчекаменной болезни.',
      price: 100000
    },
    tasks: [
      {
        title: 'Задача 1',
        description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет. Среди фруктов яблоко является очень распространенным продуктом и практически целый год присутствует в нашем рационе питания. Употребление этих плодов натощак недопустимо при гастритах с повышенной кислотностью, язвенных болезнях, желчекаменной болезни.',
        price: 100000,
        finished_at: '12.01.2021',
        created_at: '02.10.2020',
        applications: [
          {
            profile: {
              pk: 1,
              avatar: 'http://yastart.ru/uploads/posts/2019-03/1553884944_10.jpg',
              name: 'Петрович',
              email: 'test@test.com'
            },
            price: 70000,
            description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет.',
            selected: false
          },
          {
            profile: {
              pk: 2,
              avatar: '',
              name: 'Иваныч',
              email: 'test@test.com'
            },
            price: 70000,
            description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет.',
            selected: true
          }
        ]
      },
      {
        title: 'Задача 2',
        description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет. Среди фруктов яблоко является очень распространенным продуктом и практически целый год присутствует в нашем рационе питания. Употребление этих плодов натощак недопустимо при гастритах с повышенной кислотностью, язвенных болезнях, желчекаменной болезни.',
        price: 100000,
        finished_at: '12.01.2021',
        created_at: '02.10.2020',
        applications: [
          {
            profile: {
              name: 'Петрович',
              email: 'test@test.com'
            },
            price: 70000,
            description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет.',
            selected: false
          },
          {
            profile: {
              name: 'Петрович',
              email: 'test@test.com'
            },
            price: 70000,
            description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет.',
            selected: true
          },
          {
            profile: {
              name: 'Петрович',
              email: 'test@test.com'
            },
            price: 70000,
            description: 'Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет.',
            selected: false
          }
        ]
      }
    ],
    event: {
      pk: 1,
      title: 'Событие 1',
      photo: 'https://stroi.mos.ru/uploads/media/main_image/0001/73/13794d0e13d08698190ae9903eb1c7b26227376c.jpeg',
      description: `
        <p>Ценность яблок кроется в их составе. Почти 80% яблок составляет вода. Остальная часть приходится на клетчатку, органические кислоты, углеводы. Именно зеленое яблоко рекомендуют употреблять во время диет. Среди фруктов яблоко является очень распространенным продуктом и практически целый год присутствует в нашем рационе питания. Употребление этих плодов натощак недопустимо при гастритах с повышенной кислотностью, язвенных болезнях, желчекаменной болезни.</p>

        <p>С целью снизить число людей с ожирением рестораны быстрого питания и сети супермаркетов вводят новые, более полезные опции (например, салаты, сэндвичи с цельнозерновым хлебом или напитки без сахара), а также предоставляют информацию о пищевой ценности продуктов в меню или на упаковке. Вторично разогретая пища, особенно если после её приготовления прошло уже несколько часов, практически не содержит ни витаминов, ни других полезных веществ. На поведение потребителей могут повлиять не только вкусовые предпочтения, но и немедленные желания получить определенную еду.</p>

        <p>Являясь одной из самых распространённых в мире сельскохозяйственных культур, рис занимает главенствующую позицию в национальной кухне сотен народов. В России до XIX века рис называли «сарацинское зерно». Более половины населения Земли питаются в основном именно рисом, что делает эту сельскохозяйственную культуру важнейшей на планете. В некоторых странах Азии из этого растения готовят такие напитки, как вино и пиво. Из рисовых зерён делают так называемую съедобную рисовую бумагу, применяемую в кондитерском деле.</p>
      `,
      started_at: '12.01.2021',
      date: '',
      event_place: 1,
      event_place_name: 'Стадион г. Казань',
      organizer: 3,
      organizer_name: 'Министерство спорта',
      sport_types: [1, 2],
      sport_types_names: 'Футбол, Волейбол',
      is_active: true
    }
  }),
  methods: {
    turnEventEditVisible (e, type = 'open') {
      switch (type) {
        case 'open':
          (Object.keys(this.eventEditPrevios).length) || (this.eventEditPrevios = JSON.parse(JSON.stringify(this.event)))
          break
        case 'cancel':
          this.event = JSON.parse(JSON.stringify(this.eventEditPrevios))
          this.eventEditPrevios = {}
          break
        case 'save':
          this.eventEditPrevios = {}
          break
      }

      this.isEventEditVisible = !this.isEventEditVisible
    },
    turnTaskEditVisible (e, type = 'open') {
      switch (type) {
        case 'open':
          (Object.keys(this.taskEditPrevios).length) || (this.taskEditPrevios = JSON.parse(JSON.stringify(this.task)))
          break
        case 'cancel':
          this.task = JSON.parse(JSON.stringify(this.taskEditPrevios))
          this.taskEditPrevios = {}
          break
        case 'save':
          this.taskEditPrevios = {}
          break
      }

      this.isTaskEditVisible = !this.isTaskEditVisible
    },
    selectApp (app, task) {
      const curSelected = app.selected
      task.applications.forEach(item => {
        item.selected = false
      })
      app.selected = !curSelected
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
