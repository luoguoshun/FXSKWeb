<template>
  <a-form :form="form">
    <a-form-item
      v-for="(k, index) in form.getFieldValue('keys')"
      :key="k.key"
      v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
      :label="index === 0 ? '送检类型' : ''"
      :required="false"
    >
      <a-select :defaultValue="k.targetType" @change="e => targetTypeChnage(e, index)" style="width: 30%; margin-right: 8px">
        <a-select-option v-for="d in sTargetTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
      </a-select>
      <a-select :defaultValue="k.type" @change="e => sTypeChnage(e, index)" style="width: 30%; margin-right: 8px">
        <a-select-option v-for="d in sTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
      </a-select>
      <a-select :defaultValue="k.flow" @change="e => flowChnage(e, index)" style="width: 30%; margin-right: 8px">
        <a-select-option v-for="d in workFlowDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
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
        <a-icon type="plus" /> 新增项
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { getMainFlow, getWorkflowDepartment, saveWorkflowDepartments, getSubmissionTypes, delWorkflowDepartments } from '@/api/system/workflow'
import { CheckField } from '@/utils/util'
const sTargetTypeDatas = [
  { 'text': '其它', 'value': 'Other'},
  { 'text': '住院号', 'value': 'AdmissionNum'},
  { 'text': '门诊号', 'value': 'OutpatientNum'}
]
export default {
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      defaultFlow: '',
      defaultType: '常规类型',
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
      workFlowDatas: [],
      sTypeDatas: [],
      sTargetTypeDatas,
      allData: [],
      id: 0
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  created () {
    this.workFlowDatas = []
    this.getSubmissionTypes()
    this.load()
  },
  mounted () {
    this.$nextTick(() => {
      // this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    load () {
      const $this = this
      getMainFlow()
      .then((res) => {
        if (!res) {
          this.$message.warning('数据加载异常', 1)
          return
        }
        res.forEach((element, i) => {
          if (element.IsDefault === '1') {
            $this.defaultFlow = element.Id
          }
          if (element.Status === '1') {
            $this.workFlowDatas.push({
              value: element.Id,
              text: element.WorkflowName
            })
          }
        })
        getWorkflowDepartment($this.record.Id).then(res => {
          if (res.length > 0) {
            const _tempData = []
            res.forEach(item => {
              _tempData.push({ 'key': this.id++, 'id': item.Id, 'type': item.STypeId, 'flow': item.WId, 'targetType': item.TargetType })
            })
            this.allData = _tempData
            this.form.setFieldsValue({
              keys: this.allData
            })
          }
        })
      })
    },
    onOk () {
      const $this = this
      return new Promise(resolve => {
        const _tempData = []
        let _isRepetition = false
        $this.allData.forEach(item => {
          const _result = $this.allData.filter(w => w.targetType === item.targetType && w.key !== item.key)
          if (_result.length > 0) {
            _isRepetition = true
          }
          _tempData.push({ 'Id': item.id, 'DId': $this.record.Id, 'WId': item.flow, 'STypeId': item.type, 'TargetType': item.targetType })
        })
        // if (_isRepetition) {
        //   $this.$message.warning('当前配置存在重复送检类型项', 1)
        //   return
        // }
        saveWorkflowDepartments({ 'ObjectDTO': _tempData }).then(res => {
          if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
            $this.$message.success('操作成功！', 1)
            resolve(true)
          } else {
            $this.$message.warning(res.Message, 1)
            resolve(false)
          }
        })
      })
    },
    getSubmissionTypes () {
      getSubmissionTypes().then(res => {
        res.forEach(element => {
          this.sTypeDatas.push({
            value: element.Content,
            text: element.Name
          })
        })
      })
    },
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
    },
    handleScroll (direction, e) {
    },
    handleDisable (disabled) {
      this.disabled = disabled
    },
    remove (k) {
      const _obj = this.allData.filter(w => w.key === k)
      if (CheckField(_obj[0].id) === false) {
        const _temp = this.allData.filter(w => w.key !== k)
        this.allData = _temp
        const { form } = this
        const keys = form.getFieldValue('keys')
        if (keys.length === 1) {
          return
        }
        this.allData = keys.filter(key => key.key !== k)
        form.setFieldsValue({
          keys: this.allData
        })
        return
      }
      delWorkflowDepartments(_obj[0].id).then(res => {
        if (res && res.ResultType === 1) {
          this.$message.success(res.Message, 1)
          const { form } = this
          const keys = form.getFieldValue('keys')
          if (keys.length === 1) {
            return
          }
          this.allData = keys.filter(key => key.key !== k)
          form.setFieldsValue({
            keys: this.allData
          })
        } else {
          this.$message.error(res.Message, 1)
        }
      })
    },
    add () {
      const { form } = this
      let keys = []
      keys = form.getFieldValue('keys')
      const _item = { 'key': this.id++, 'type': 'Routine', 'flow': 8, 'targetType': 'Other' }
      this.allData = keys.concat(_item)
      form.setFieldsValue({
        keys: this.allData
      })
    },
    sTypeChnage (e, index) {
      this.allData.filter(w => w.key === index).filter(w => { w.type = e })
    },
    flowChnage (e, index) {
      this.allData.filter(w => w.key === index).filter(w => { w.flow = e })
    },
    targetTypeChnage (e, index) {
      this.allData.filter(w => w.key === index).filter(w => { w.targetType = e })
    }
  }
}
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
