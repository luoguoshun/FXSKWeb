<template>
  <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-form-item label="客户端IP">
      <a-input v-decorator="['IP', {rules: [{required: true, message: '请输入客户端IP'}]}]" />
    </a-form-item>
    <a-form-item label="映射类型">
      <a-select style="width: 220px" v-decorator="['Type', {rules: [{required: true, message: '请选择映射类型'}]}]">
        <a-select-option v-for="item in enums.MapType" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="映射值">
      <a-input v-decorator="['Value', {rules: [{required: true, message: '请输入映射值'}]}]" />
    </a-form-item>
    <a-form-item label="映射值类型">
      <a-select style="width: 220px" v-decorator="['ValueType', {rules: [{required: true, message: '请选择映射值类型'}]}]">
        <a-select-option v-for="item in enums.MapValueType" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="备注信息">
      <a-textarea v-decorator="['Remark']"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { saveClienMapConfig } from '@/api/system/clienMapConfig'
import enums from '@/store/enum/enum'
const fields = ['IP', 'Type', 'Value', 'ValueType', 'Remark']
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
      form: this.$form.createForm(this),
      id: 0,
      enums
    }
  },
  created () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
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
            saveClienMapConfig(values).then((res) => {
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
