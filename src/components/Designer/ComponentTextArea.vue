<template>
  <div>
    <a-textarea placeholder="" :rows="4" @change="onChange" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }" />
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
    }
  }
}
</script>
