<template>
  <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-form-item label="客户端IP">
      <a-input v-decorator="['IP', {rules: [{required: true, message: '请输入客户端IP'}]}]" />
    </a-form-item>
    <a-form-item label="请求类型">
      <a-select v-decorator="['ReqType', {rules: [{required: true, message: '请输入请求类型'}]}]">
        <a-select-option v-for="d in specimenNameType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { saveHisReqTypeConfig } from '@/api/system/hisReqConfig'
const fields = ['IP', 'ReqType']
export default {
  name: 'Edit',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 20 }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      },
      form: this.$form.createForm(this),
      id: 0,
      specimenNameType: [
        { 'text': '病人Id', 'value': '1' },
        { 'text': '住院号', 'value': '2' },
        { 'text': '门诊号', 'value': '3' },
        { 'text': '手腕码', 'value': '7' }
      ]
    }
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            saveHisReqTypeConfig(values).then((res) => {
              if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
                this.$message.success('操作成功！', 2)
                setTimeout(() => {
                  resolve(true)
                }, 500)
              } else {
                this.$message.warning(res.Message, 2)
                resolve(false)
              }
          }).catch(error => {
              this.$message.error(error.$message, 2)
              resolve(false)
          })
          }
        })
      })
    },
    onCancel () {
      return new Promise(resolve => {
        resolve(true)
      })
    }
  }
}
</script>
