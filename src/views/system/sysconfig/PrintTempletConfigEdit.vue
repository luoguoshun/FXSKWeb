<template>
  <div>
    <a-form
      :form="form"
      class="strategyTemplateEdit"
      :layout="layout"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-item v-show="false" label="主键ID">
        <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
      </a-form-item>
      <a-row>
        <a-col :span="24">
          <a-form-item label="模板名称">
            <a-input v-decorator="['Name', { initialValue: record.Name }]"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="模板信息">
            <a-textarea v-decorator="['Content', { initialValue: record.Content }]" style="height: 400px"></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
const fields = ['Id', 'Name', 'Content']
import { savePrintTemplet } from '@/api/system/dictionary'
import enums from '@/store/enum/enum'
import pick from 'lodash.pick'
export default {
  name: 'StrategyTemplateEdit',
  components: {
  },
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      enums,
      form: this.$form.createForm(this),
      layout: 'horizontal',
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      }
    }
  },
  beforeCreate () {
  },
  created: function () {
   
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  computed: {
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            values.Id = this.record.Id
            values.Content = values.Content.substring((values.Content.indexOf('^LS0') + 4), values.Content.length)
            values.Content = values.Content.replace(/A0N/g, 'A1N')
            values.Content = '^XA^CW1,E:SIMSUN.FNT^CI28,2~SD25' + values.Content
            savePrintTemplet(values).then(res => {
              if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
                this.$message.success('操作成功！', 2)
                setTimeout(() => {
                  resolve(true)
                }, 500)
              } else {
                this.$message.warning(res.Message, 2)
                resolve(false)
              }
            })
          }
        })
      })
    }
  }
}
</script>
<style>
.strategyTemplateEdit .ant-divider{
  margin: 5px 0;
}
.flag .ant-col-17 { width:100%;}
.strategyTemplateEdit .ant-row .ant-form-item{
 margin-bottom:5px;
}
.ant-modal-footer {
  z-index: 999999;
  position: sticky;
  bottom: 0px;
  background-color: #ffffff
}
</style>
