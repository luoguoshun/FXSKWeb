<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="12">
        <a-form-item label="检查项目名">
          <a-input v-decorator="['ItemName', {rules: [{required: true, message: '请输入检查项目名'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="检查项目英文名">
          <a-input v-decorator="['ItemEName']" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="检查项目代码">
          <a-input v-decorator="['ItemCode', {rules: [{required: true, message: '请输入检查项目代码'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="送检类型">
          <a-select v-decorator="['PathologyCode', {rules: [{required: true, message: '请选择送检类型'}]}]" >
            <a-select-option v-for="d in pathologyCodeType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="8">
        <a-form-item label="费用">
          <a-input-number name="CostAmount" :min="0" v-decorator="['CostAmount', {initialValue: 0}]"/>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="状态">
          <a-radio-group name="State" v-decorator="['State', {initialValue: (Number(record.Status) >= 0 ? Number(record.Status):1)}]">
            <a-radio :value="0">
              停用
            </a-radio>
            <a-radio :value="1">
              在用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="排序">
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
import { saveCheckItem, insertCheckItem } from '@/api/basics/checkitem'
import { getSubmissionTypes } from '@/api/system/workflow'
import { CheckField } from '@/utils/util'

const fields = ['Id', 'ItemCode', 'ItemName', 'CostAmount', 'ItemEName', 'SortOrder', 'Remark', 'PathologyCode']
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
      layout: 'horizontal',
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
      form: this.$form.createForm(this),
      pathologyCodeType: []
    }
  },
  created () {
    this.getSubmissionTypes()
  },
  mounted () {
    if (CheckField(this.record.Id) === false) {
      this.record.PathologyCode = 'Common'
    }
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
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
        this.pathologyCodeType.push({
          value: 'Common',
          text: '一般送检'
        })
      })
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            if (values.Id > 0) {
              this.save(values, resolve)
            } else {
              this.add(values, resolve)
            }
          }
        })
      })
    },
    save (values, resolve) {
      saveCheckItem(values).then((res) => {
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
    },
    add (values, resolve) {
      insertCheckItem(values).then((res) => {
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
