<template lang="pug">
  .page(:class="{'page--wide': isCollapseNav}")
    .events
      el-breadcrumb(separator="/")
        el-breadcrumb-item(:to="{ path: '/' }")
          i.el-icon-s-home
        el-breadcrumb-item &nbsp;
      h1 Мероприятия
        el-button(type="success" icon="el-icon-plus" circle)
      .filters
        el-input(placeholder="Искать.." v-model="search" clearable)
          i.el-input__icon.el-icon-search(slot="suffix")

        el-select(
            v-model="filter.sport_types"
            filterable
            clearable
            multiple
            placeholder="Вид спорта"
            :loading-text="options.select.loadingText"
            :no-match-text="options.select.noMatchText"
            :no-data-text="options.select.noDataText"
          )
          el-option(v-for="item in sport_types" :key="item.value" :label="item.label" :value="item.value")

        el-select(
            v-model="filter.event_place"
            filterable
            clearable
            placeholder="Площадка"
            :loading-text="options.select.loadingText"
            :no-match-text="options.select.noMatchText"
            :no-data-text="options.select.noDataText"
          )
          el-option(v-for="item in places" :key="item.value" :label="item.label" :value="item.value")

        el-date-picker(
            v-model="value2"
            type="daterange"
            align="right"
            unlink-panels
            range-separator=" - "
            start-placeholder="От"
            end-placeholder="До"
            :picker-options="pickerOptions"
          )

      el-table(:data="getData()" @row-click="openEvent")
        el-table-column(label="Название" prop="title")
        el-table-column(label="Дата" prop="started_at")
        el-table-column(label="Площадка" prop="event_place_name")
        el-table-column(label="Виды спорта" prop="sport_types_names")
        el-table-column(label="Активность" prop="is_active" align="center")
          template(slot-scope="scope")
            i.el-icon-success.green(v-if="scope.row.is_active")

  //-- заголовок, дата, активно/прошло, возможно какая-то статистика - типа прогресса по организации, количество участников и тд площадка, дата/время
</template>

<script>
import { mapState } from 'vuex'

import { autoKeyboardLang } from '@/other'

export default {
  name: 'Events',
  computed: mapState([
    'isAuth',
    'isCollapseNav'
  ]),
  data: () => ({
    options: {
      select: {
        loadingText: 'Данные загружаются',
        noMatchText: 'Нет совпадений',
        noDataText: 'Данные отсутствуют'
      }
    },
    search: '',
    filter: {
      sport_types: [],
      event_place: undefined
    },
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
    pickerOptions: {
      shortcuts: [{
        text: 'Неделя',
        onClick (picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: 'Месяц',
        onClick (picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '3 месяца',
        onClick (picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }]
    },
    value1: '',
    value2: '',
    events: [
      {
        pk: 1,
        title: 'Событие 1',
        started_at: '12.01.2021',
        event_place: 1,
        event_place_name: 'Стадион г. Казань',
        organizer: 3,
        organizer_name: 'Министерство спорта',
        sport_types: [1],
        sport_types_names: 'Футбол',
        is_active: true
      },
      {
        pk: 2,
        title: 'Событие 2',
        started_at: '12.02.2021',
        event_place: 1,
        event_place_name: 'Стадион г. Казань',
        organizer: 3,
        organizer_name: 'Министерство спорта',
        sport_types: [1, 2],
        sport_types_names: 'Футбол, Волейбол',
        is_active: false
      }
    ]
  }),
  methods: {
    getData () {
      const vm = this
      const eventFields = ['title', 'started_at', 'event_place_name', 'organizer_name', 'sport_types_names']

      // if (!this.search.length) return this.events

      return this.events.filter(item => {
        const isSearch = eventFields.reduce((res, field) => {
          const str = new RegExp(vm.search.toLowerCase().trim(), 'i')
          const strFromEng = new RegExp(autoKeyboardLang(vm.search.toLowerCase().trim()), 'i')

          return str.test(item[field]) || strFromEng.test(item[field]) || !!res
        }, false)

        const isEventPlace = vm.filter.event_place ? vm.filter.event_place === item.event_place : true

        const isSportTypes = vm.filter.sport_types.length ? vm.filter.sport_types.reduce((res, type) => item.sport_types.includes(type) || res, false) : true

        return isSearch && isEventPlace && isSportTypes
      })
    },
    openEvent (event) {
      this.$router.push({ name: 'event', params: { eventId: event.pk } })
      // console.log(event)
    }
  }
}
</script>

<style lang="less">
  .filters {
    padding-bottom: 10px;
    // border-bottom: 1px solid #dcdfe6;

    .el-input, .el-select {
      width: 200px;
      margin-right: 20px;
    }
  }
  .el-table__row {
    cursor: pointer;
  }
  .el-icon-circle-check, .el-icon-success {
    font-size: 20px;
  }
</style>
