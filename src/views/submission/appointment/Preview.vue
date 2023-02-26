<template>
  <div>
    <a-button type="primary" icon="printer" @click="print">预览打印</a-button>
    <k-form-build id="form" ref="kfb" :value="jsonData"/>
  </div>
</template>
<script>
import ComponentInitializer from '@/core/components/componentRegistrar'
import { getTemplateByCode } from '@/api/system/pageTemplate'
import { CheckField, JSONStringToObject } from '@/utils/util'
import Print from '@/utils/print'
export default {
  name: 'Demo',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      jsonData: {
        list: [
        ],
        config: {
        }
      }
    }
  },
  created: function () {
    ComponentInitializer()
    this.initialize()
  },
  methods: {
    initialize () {
      if (CheckField(this.record)) {
        if (this.record.Sex === 0) {
          this.record.Sex = '男'
        } else {
          this.record.Sex = '女'
        }
        this.record.Age = this.record.AgeYear + '岁' + this.record.AgeMonth + '月' + this.record.AgeDay + '日'
      }
      getTemplateByCode('Appointment').then(res => {
        this.jsonData = JSONStringToObject(res.data.Content)
        setTimeout(() => {
          this.$refs.kfb.setData(this.record)
        }, 500)
      })
    },
    print () {
      Print('#form', {
        onStart: function () {
        },
        onEnd: function () {
        }
      })
      // Print(this.$refs.print.$vnode.elm)
    }
  }
}
</script>
