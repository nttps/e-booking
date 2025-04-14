<script setup lang="ts">
import moment from 'moment'
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  dateTime: {
    type: Boolean,
    default: false
  },
  minDate: {
    type: Date,
    default: new Date()
  }
})


const emit = defineEmits(['update:model-value', 'close'])
const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value ? props.dateTime ? moment(value).format('YYYY-MM-DDTHH:mm') : moment(value).format('YYYY-MM-DD') : null)
    emit('close')
  }
})
const attrs = [{
    key: 'today',
    highlight: {
        color: 'orange',
        fillMode: 'outline',
        class: '!bg-gray-100 dark:!bg-gray-800'
    },
    dates: new Date()
}]
</script>
<template>
  <VCalendarDatePicker
    v-model="date"
    transparent
    borderless
    :attributes="attrs"
    title-position="left"
    color="orange"
    trim-weeks
    :first-day-of-week="2"
    :mode="props.dateTime ? `dateTime` : `date`" is24hr
    hide-time-header
    :min-date="props.minDate ? props.minDate : new Date()"
    locale="th"
  />
</template>