<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="11">
        <a-form-item label="用户">
          <a-select v-decorator="['Employee', {rules: [{required: true, message: '请选择用户'}]}, { initialValue: record.Employee }]">
            <a-select-option v-for="item in departments" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="11">
        <a-form-item label="模板">
          <a-select v-decorator="['Template', {rules: [{required: true, message: '请选择模板'}]}, { initialValue: record.Template }]">
            <a-select-option v-for="item in templates" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="11">
        <a-form-item label="状态">
          <a-radio-group name="Status" v-decorator="['Status', {initialValue: (Number(record.Status) >= 0 ? Number(record.Status):1)}]">
            <a-radio :value="0">
              禁用
            </a-radio>
            <a-radio :value="1">
              启用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { getSysUserData } from '@/api/system/user'
import { getStrategyTemplateData, saveStrategy } from '@/api/system/strategy'
import pick from 'lodash.pick'
const fields = ['Id', 'Employee', 'Template', 'Status']
export default {
  name: 'StrategySettingUserEdit',
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  components: {
  },
  data () {
    return {
      layout: 'horizontal',
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
      form: this.$form.createForm(this),
      departments: [],
      templates: []
    }
  },
  created: function () {
  },
  computed: {
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
    this.load()
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            saveStrategy(values).then((res) => {
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
    load () {
      getSysUserData('', { 'current': 1, 'pageSize': 99999 }).then(res => {
        res.data.forEach(item => {
          this.departments.push({ 'text': item.UserName, 'value': item.Id })
        })
      })
      getStrategyTemplateData().then(res => {
        res.data.forEach(item => {
          if (item.Code === 'AppEdit') {
            this.templates.push({ 'text': item.Name, 'value': item.Id })
          }
        })
      })
    }
  }
}
</script>
