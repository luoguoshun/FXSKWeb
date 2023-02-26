<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="11">
        <a-form-item label="流程代码">
          <a-input v-decorator="['WorkflowCode', {rules: [{required: true, message: '请输入代码'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="11">
        <a-form-item label="流程名称">
          <a-input v-decorator="['WorkflowName', {rules: [{required: true, message: '请输入名称'}]}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="11">
        <a-form-item label="标本状态">
          <a-select v-decorator="['SpecimenStatus', {initialValue: record.SpecimenStatus}]" >
            <a-select-option v-for="d in sStatustemplateDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="11">
        <a-form-item label="页面编号">
          <a-select v-decorator="['MenuCode', {initialValue: record.MenuCode}]" >
            <a-select-option v-for="d in menuTemplateDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
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
      <a-col :span="2"></a-col>
      <a-col :span="11">
        <a-form-item label="流程排序">
          <a-input-number name="SortOrder" :min="1" :max="100" v-decorator="['SortOrder', {initialValue: 1}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="备注" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-textarea v-decorator="['Remark']"></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { getSpecimenStatus } from '@/api/system/workflowtool'
import { saveFlow } from '@/api/system/workflow'
import { getMenuData } from '@/api/system/menu'

const fields = ['Id', 'SortOrder', 'IsDefault', 'SpecimenStatus', 'WorkflowCode', 'WorkflowName', 'Remark', 'MenuCode', 'Status']

export default {
  name: 'NodeEdit',
  props: {
    record: {
      type: Object,
      default: null
    }
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
      sStatustemplateDatas: [], // 标本状态
      menuTemplateDatas: [] // 菜单
    }
  },
  created () {
    this.loadSpecimenStatus()
    this.loadMenuData()
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    loadSpecimenStatus () {
      getSpecimenStatus().then((res) => {
        for (var key in res) {
          if (key === 'None') {
            continue
          }
          this.sStatustemplateDatas.push({
            value: res[key].toString(),
            text: key
          })
        }
      })
    },
    loadMenuData () {
      getMenuData().then((res) => {
        const mainData = []
        res.data.forEach((item) => {
          if (item.ParentId === -1) {
            mainData.push(item)
          }
        })
        mainData.forEach((item) => {
          if (item.NodeName === '送检管理v3') {
            res.data.forEach((citem) => {
              if (citem.ParentId === item.Id && citem.NodeName !== '标本查询') {
                this.menuTemplateDatas.push({
                  value: citem.NodeCode,
                  text: citem.NodeName
                })
              }
            })
          }
        })
      })
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            values.WorkflowType = '2'
            saveFlow(values).then((res) => {
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
      this.sourceData = []
      this.targetKeys = []
      return new Promise(resolve => {
        resolve(true)
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
    }
  }
}
</script>
