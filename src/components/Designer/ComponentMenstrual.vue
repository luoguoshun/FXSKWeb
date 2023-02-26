<template>
  <div>
    <a-date-picker v-model="MenstrualTime" @change="onChange" />
    <a-checkbox v-model="IsMenstrualTime" @change="changeMenstraul" style="margin-left:5px;">否</a-checkbox>
  </div>
</template>
<script>
import { CheckField } from '@/utils/util'

export default {
  name: 'Menstrual',
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    value: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      MenstrualTime: undefined,
      IsMenstrualTime: false
    }
  },
  created: function () {
    if (CheckField(this.$attrs.dynamicData.editData.IsMenstrualTime)) {
      this.record.rules[0].required = false
      this.MenstrualTime = this.$attrs.dynamicData.editData.MenstrualTime
      this.IsMenstrualTime = this.$attrs.dynamicData.editData.IsMenstrualTime
    }
  },
  methods: {
    onChange (val) {
      this.$attrs.dynamicData.editData.MenstrualTime = val.format('YYYY-MM-DD HH:mm:ss')
    },
    changeMenstraul (obj) {
      if (obj.target.checked) {
        this.record.rules[0].required = false
      } else {
        this.record.rules[0].required = true
      }
    }
  }
}
</script>
