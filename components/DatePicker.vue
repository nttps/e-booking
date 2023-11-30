<script setup lang="ts">
import moment from 'moment';
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const props = defineProps(['modelValue', 'minDate'])

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue ?? moment().format('YYYY-MM-DDT00:00:00'),
  set: (value) => {
    emit('update:model-value', moment(value).format('YYYY-MM-DDT00:00:00'))
    emit('close')
  }
})

const attrs = [{
  key: 'today',
  highlight: {
    color: 'blue',
    fillMode: 'outline',
    class: '!bg-gray-100 dark:!bg-gray-800'
  },
  masks: {
    input: 'DD/MM/YYYY',
  },
  dates: new Date()
}]
</script>

<template>
  <VCalendarDatePicker v-model="date" :attributes="attrs" :popover="false" :min-date="props.minDate">
      <template v-slot="{ inputValue, inputEvents, togglePopover }">
          <UButton icon="i-heroicons-calendar-days-20-solid" class="w-full text-xl" :label="`${inputValue}`" @click="() => togglePopover()" />
      </template>
  </VCalendarDatePicker>
</template>