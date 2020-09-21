<template lang="pug">
  .page(:class="{'page--wide': isCollapseNav}")
    .events
      el-breadcrumb(separator="/")
        el-breadcrumb-item(:to="{ path: '/' }")
          i.el-icon-s-home
        el-breadcrumb-item &nbsp;
      h1 Задачи
        //-- el-button(type="success" icon="el-icon-plus" circle @click="isOpenEventDialog = true")

      //-- EventDialog(:sync="isOpenEventDialog" @sync="isOpenEventDialog = $event" @save="event = $event" :data="event")

      .filters
        el-input(placeholder="Искать.." v-model="search" clearable)
          i.el-input__icon.el-icon-search(slot="suffix")

        el-select(
            v-model="filter.contractor_type"
            filterable
            clearable
            placeholder="Тип задачи"
          )
          el-option(v-for="item in contractorsTypes" :key="item.value" :label="item.title" :value="item.value")

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

        el-radio(v-model="filter.own" label="1") Отправлена заявка
        el-radio(v-model="filter.own" label="0") Остальные

      el-table(:data="getData()" @row-click="openTask")
        el-table-column(label="Название" prop="title")
        el-table-column(label="Мероприятие" prop="event_title")
        el-table-column(label="Дедлайн" prop="finished_at")
          template(slot-scope="scope")
            span(v-text="formatDateTime(scope.row.started_at)")
        el-table-column(label="Бюджет" prop="price")
        el-table-column(label="Завершено" prop="completed" align="center")
          template(slot-scope="scope")
            i.el-icon-success.green(v-if="scope.row.completed")

  //-- заголовок, дата, активно/прошло, возможно какая-то статистика - типа прогресса по организации, количество участников и тд площадка, дата/время
</template>

<script>
import { mapState } from 'vuex'

import { autoKeyboardLang, formatDateTime } from '@/other'
import EventDialog from '@/components/EventDialog'

import { defaultRequest } from '@/requests'
const requests = defaultRequest(JSON.parse(localStorage.getItem('serp__Token')).value)

export default {
  name: 'Tasks',
  computed: mapState([
    'isAuth',
    'user',
    'isCollapseNav',
    'sportTypes',
    'eventPlaces',
    'contractorsTypes'
  ]),
  components: {
    EventDialog
  },
  mounted () {
    this.getTasks()
  },
  watch: {
    event (val) {
      this.getTasks()
    }
  },
  data: () => ({
    isOpenEventDialog: false,
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
      event_place: undefined,
      contractor_type: undefined,
      own: '1'
    },
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
    tasks: []
  }),
  methods: {
    getData () {
      const vm = this
      const eventFields = ['title']

      // if (!this.search.length) return this.events

      return this.tasks.filter(item => {
        const isSearch = eventFields.reduce((res, field) => {
          const str = new RegExp(vm.search.toLowerCase().trim(), 'i')
          const strFromEng = new RegExp(autoKeyboardLang(vm.search.toLowerCase().trim()), 'i')

          return str.test(item[field]) || strFromEng.test(item[field]) || !!res
        }, false)

        const isContractorType = vm.filter.contractor_type ? vm.filter.contractor_type === item.contractor_type : true

        const isOwnRow = item.applications_obj.reduce((res, i) => i.profile.id === vm.user.id || res, false)
        const isOwn = vm.filter.own === '1' ? isOwnRow : !isOwnRow

        return isSearch && isContractorType && isOwn
      })
    },
    openTask (task) {
      this.$router.push({ name: 'task', params: { taskId: task.id } })
      // console.log(event)
    },
    getTasks () {
      requests.get('task/?visible_to_contractors=1') // ?visible_to_contractors
        .then(response => {
          this.tasks = response.data
        })
    },
    getListFromObject (obj, field) {
      return obj.map((item, i) => { return item[field] }).join(', ')
    },
    formatDateTime (datetime) {
      return formatDateTime(datetime, 'datetime', true)
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
    .el-date-editor {
      width: 300px;
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
