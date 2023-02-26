<template>
  <a-form @submit="handleSubmit" :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
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
        <a-form-item label="是否默认">
          <a-radio-group name="IsDefault" v-decorator="['IsDefault', {initialValue: (Number(record.IsDefault) >= 0 ? Number(record.IsDefault):0)}]">
            <a-radio :value="0">
              非默认
            </a-radio>
            <a-radio :value="1">
              默认
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="2"></a-col>
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
    <a-row>
      <a-col :span="12">
        <a-form-item label="流程排序">
          <a-input-number name="SortOrder" :min="1" :max="100" v-decorator="['SortOrder', {initialValue: 1}]"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="">
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col label="" :span="24">
        <a-transfer
          :data-source="dataSource"
          :titles="['未选择', '已选择']"
          :target-keys="targetKeys"
          :selected-keys="selectedKeys"
          :render="item => item.title"
          :list-style="{ width: '300px', height: '300px' }"
          @change="handleChange"
          @selectChange="handleSelectChange"
          @scroll="handleScroll" />
      </a-col>
    </a-row>
    <div style="margin-bottom:15px"></div>
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
import { getSelectWorkflows, saveFlow } from '@/api/system/workflow'

const fields = ['Id', 'SortOrder', 'WorkflowCode', 'WorkflowName']
export default {
  name: 'Edit',
  props: {
    record: {
      type: Object,
      default: null
    },
    comback: {
      type: Function,
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
      dataSource: [],
      targetKeys: [],
      selectedKeys: [],
      isCheckedOut: false
    }
  },
  created () {
    const $this = this
    getSelectWorkflows(this.record.Id ?? 0).then((res) => {
      res.Workflows.forEach((element, i) => {
        $this.dataSource.push({
          key: element.Id.toString(), // Mark：这里一定要转成string类型，因为数据源格式是string，不然会报 【Invalid prop】 错误
          title: element.WorkflowName,
          description: element.WorkflowName
        })
      })
      if (this.record.Id) {
        res.Items.forEach(element => {
          $this.dataSource.forEach((item) => {
            if (item.key === element.ChildId.toString()) {
              $this.targetKeys.push(element.ChildId.toString())
            }
          })
        })
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    handleSubmit (e) {
      this.isTemManageShow = false
      e.preventDefault()
      const { form: { validateFields } } = this
      const $this = this
      validateFields((errors, values) => {
        if (!errors) {
          $this.onOk()
        }
      })
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            const ItemsData = []
            this.targetKeys.forEach((element) => {
              ItemsData.push({ ChildId: element })
            })
            values.Items = ItemsData
            values.WorkflowType = '1'
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
