<template>
  <div>
    <k-form-build id="form" ref="kfb" :value="jsonData"/>
  </div>
</template>
<script>
import ComponentInitializer from '@/core/components/componentRegistrar'
import { getTemplateByCode } from '@/api/system/pageTemplate'
import { CheckField, JSONStringToObject, ObjectToJSONString } from '@/utils/util'

export default {
  name: 'ExamItemTemplate',
  props: {
    record: {
      type: Object,
      default: null
    },
    parentObj: {
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
  computed: {
  },
  methods: {
    initialize () {
      getTemplateByCode(this.record.ExamItemTemplateCode).then(res => {
        if (CheckField(res.data)) {
          this.jsonData = JSONStringToObject(res.data.Content)
          if (CheckField(this.record) && CheckField(this.record.ExamItemTemplate)) {
            setTimeout(() => {
              this.$refs.kfb.setData(JSONStringToObject(this.record.ExamItemTemplate))
            }, 500)
          }
        }
      })
    },
    onCancel () {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    onOK () {
      return new Promise(resolve => {
        this.$refs.kfb.getData().then(values => {
          this.parentObj.examItemTemplateCallBack(ObjectToJSONString(values))
          setTimeout(() => {
            resolve(true)
          }, 500)
        }).catch((e) => {
          resolve(false)
        })
      })
    }
  }
}
</script>