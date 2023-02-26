<template>
  <div>
    <a-button type="primary" icon="printer" @click="print">预览打印</a-button>
    <k-form-build id="form" ref="kfb" :value="jsonData"/>
  </div>
</template>
<script>
import ComponentInitializer from '@/core/components/componentRegistrar'
import { getTemplateByCode } from '@/api/system/pageTemplate'
import { JSONStringToObject } from '@/utils/util'
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
      getTemplateByCode('Preview').then(res => {
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
