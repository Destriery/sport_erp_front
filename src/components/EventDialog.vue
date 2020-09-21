<template lang="pug">
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
          el-option(v-for="item in sportTypes" :key="item.id" :label="item.title" :value="item.id")
      el-form-item(label="Площадка:")
        el-select(
            v-model="event.event_place"
            filterable
            clearable
            placeholder="Площадка"
          )
          el-option(v-for="item in eventPlaces" :key="item.id" :label="item.title" :value="item.id")

      el-form-item(label="Описание:")
        el-input(v-model="event.description" type="textarea" :autosize="{ minRows: 5, maxRows: 10}")
    span.dialog-footer(slot="footer")
      el-button(@click="turnEventEditVisible($event, 'cancel')") Отмена
      el-button(@click="turnEventEditVisible($event, 'save')" type="success") Сохранить
</template>

<script>
import { mapState } from 'vuex'

import { defaultRequest } from '@/requests'
const requests = (localStorage.getItem('serp__Token')) ? defaultRequest(JSON.parse(localStorage.getItem('serp__Token')).value) : ''

export default {
  name: 'EventDialog',
  props: {
    sync: Boolean,
    data: {
      default: () => ({})
    }
  },
  data: () => ({
    isEventEditVisible: false,
    eventEditPrevios: {},
    event: {
      pk: 1,
      title: '',
      photo: '',
      description: '',
      started_at: '',
      date: '',
      event_place: 1,
      sport_types: [],
      is_active: false
    }
  }),
  computed: mapState([
    'isAuth',
    'isCollapseNav',
    'sportTypes',
    'eventPlaces'
  ]),
  watch: {
    sync (val) {
      if (val) {
        this.turnEventEditVisible()
      }
    }
  },
  methods: {
    formatEventData (inputData) {
      const data = JSON.parse(JSON.stringify(inputData))
      delete data.photo

      return data
    },
    turnEventEditVisible (e, type = 'open') {
      const vm = this
      const saveMethod = (this.event.id) ? 'patch' : 'post'
      const eventId = (saveMethod === 'patch') ? this.$route.params.eventId + '/' : ''

      switch (type) {
        case 'open':
          this.event = JSON.parse(JSON.stringify(this.data))
          // (Object.keys(this.eventEditPrevios).length) || (this.eventEditPrevios = JSON.parse(JSON.stringify(this.event)))
          break
        case 'cancel':
          // this.event = JSON.parse(JSON.stringify(this.eventEditPrevios))
          // this.eventEditPrevios = {}
          break
        case 'save':
          requests[saveMethod](`event/${eventId}`, this.formatEventData(this.event))
            .then(response => {
              vm.$emit('save', response.data)
            })
          this.eventEditPrevios = {}
          break
      }

      this.isEventEditVisible = !this.isEventEditVisible

      this.$emit('sync', this.isEventEditVisible)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
