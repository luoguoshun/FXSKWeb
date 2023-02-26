<template>
  <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-form-item label="客户端IP">
      <a-input v-decorator="['IP', {rules: [{required: true, message: '请输入客户端IP'}]}]" />
    </a-form-item>
    <a-form-item label="打印机类型">
      <a-input v-decorator="['PrintType', {rules: [{required: true, message: '请输入打印机类型'}]}]" />
    </a-form-item>
    <a-form-item label="作用目标">
      <a-select style="width: 220px" v-decorator="['Target', {rules: [{required: true, message: '请选择作用目标'}]}]">
        <a-select-option v-for="item in enums.PrintTarget" :key="item.value" :value="item.value">{{ item.text }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      v-for="(k, index) in form.getFieldValue('keys')"
      :key="k.key"
      v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
      :label="index === 0 ? '标签模板' : ''"
      :required="false"
    >
      <a-select :defaultValue="k.type" @change="e => TypeChnage(e, index)" style="width: 40%; margin-right: 8px">
        <a-select-option v-for="d in pathologyCodeType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
      </a-select>
      <a-select :defaultValue="k.templet" @change="e => TempletChnage(e, index)" style="width: 220px">
        <a-select-option v-for="d in TempPrintTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
      </a-select>
      <a-icon
        v-if="form.getFieldValue('keys').length > 1"
        class="dynamic-delete-button"
        type="minus-circle-o"
        :disabled="form.getFieldValue('keys').length === 1"
        @click="() => remove(k.key)"
      />
    </a-form-item>
    <a-form-item v-bind="formItemLayoutWithOutLabel">
      <a-button type="dashed" style="width: 60%" @click="add">
        <a-icon type="plus" /> 新增模板项
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { savePrintConfig } from '@/api/system/printconfig'
import { getPrintTempDicts } from '@/api/system/dictionary'
import { CheckField, ObjectToJSONString, JSONStringToObject } from '@/utils/util'
import enums from '@/store/enum/enum'
import { getSubmissionTypes } from '@/api/system/workflow'
const fields = ['IP', 'PrintType', 'Target']
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
      pathologyCodeType: [],
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
      allData: [],
      form: this.$form.createForm(this),
      TempPrintTypeDatas: [],
      id: 0,
      enums
    }
  },
  created () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
    getPrintTempDicts().then((res) => {
      res.data.forEach(element => {
        this.TempPrintTypeDatas.push({ 'text': element.Name, 'value': element.Name })
      })
    })
    this.getSubmissionTypes()
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
    const _tempData = []
    JSONStringToObject(this.record.Templet).forEach(item => {
      _tempData.push({ 'key': this.id++, 'type': item.type, 'templet': item.templet })
    })
    this.allData = _tempData
    this.form.setFieldsValue({
      keys: this.allData
    })
  },
  methods: {
    getSubmissionTypes () {
      getSubmissionTypes().then(res => {
        res.forEach(element => {
          this.pathologyCodeType.push({
            value: element.Content,
            text: element.Name
          })
        })
      })
    },
    add () {
      const { form } = this
      let keys = []
      keys = CheckField(form.getFieldValue('keys')) === false ? keys : form.getFieldValue('keys')
      const _item = { 'key': this.id++, 'type': 'Routine', 'templet': '' }
      this.allData = keys.concat(_item)
      form.setFieldsValue({
        keys: this.allData
      })
    },
    remove (k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      if (keys.length === 1) {
        return
      }
      this.allData = keys.filter(key => key.key !== k)
      form.setFieldsValue({
        keys: this.allData
      })
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            values.Templet = ObjectToJSONString(this.allData)
            savePrintConfig(values).then((res) => {
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
    },
    TypeChnage (e, index) {
      this.allData.filter(w => w.key === index).filter(w => { w.type = e })
    },
    TempletChnage (e, index) {
      this.allData.filter(w => w.key === index).filter(w => { w.templet = e })
    }
  }
}
</script>
