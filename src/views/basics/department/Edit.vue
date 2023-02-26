<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="12">
        <a-form-item label="上级结构">
          <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="DeptDatas"
            placeholder="请选择上级结构"
            tree-default-expand-all
            v-decorator="['PId', {rules: [{required: true, message: '请选择上级结构'}]}, {initialValue: record.PId}]"
          >
          </a-tree-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="科室代码">
          <a-input v-decorator="['DeptCode', {rules: [{required: true, message: '请输入科室代码'}]}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="科室英文名">
          <a-input v-decorator="['DeptEName']" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="科室名称">
          <a-input v-decorator="['DeptName', {rules: [{required: true, message: '请输入科室名称'}]}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="科室简称">
          <a-input v-decorator="['SimpleName']" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="特殊科室">
          <a-select v-decorator="['DeptPRO']" >
            <a-select-option v-for="d in deptPRODatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="科室类型">
          <a-select v-decorator="['DeptType']" >
            <a-select-option v-for="d in deptTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="核算科室">
          <a-radio-group name="TatdeptFlag" v-decorator="['TatdeptFlag', {initialValue: (Number(record.TatdeptFlag) >= 0 ? Number(record.TatdeptFlag):1)}]">
            <a-radio :value="0">
              否
            </a-radio>
            <a-radio :value="1">
              是
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="挂号科室">
          <a-radio-group name="RegdeptFlag" v-decorator="['RegdeptFlag', {initialValue: (Number(record.RegdeptFlag) >= 0 ? Number(record.RegdeptFlag):1)}]">
            <a-radio :value="0">
              否
            </a-radio>
            <a-radio :value="1">
              是
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="有效性">
          <a-radio-group name="ValidState" v-decorator="['ValidState', {initialValue: '1'}]">
            <a-radio :value="'0'">
              停用
            </a-radio>
            <a-radio :value="'1'">
              在用
            </a-radio>
            <a-radio :value="'2'">
              废弃
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :span="12">
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
import { saveDepartment, getDepartmentPageData } from '@/api/basics/department'
const fields = ['Id', 'PId', 'DeptCode', 'DeptName', 'DeptEName', 'ValidState', 'SimpleName', 'DeptType', 'DeptPRO', 'SortOrder', 'Remark']
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
      deptTypeDatas: [
        { value: 'C', text: '门诊' },
        { value: 'I', text: '住院' },
        { value: 'F', text: '财务' },
        { value: 'L', text: '后勤' },
        { value: 'PI', text: '药库' },
        { value: 'T', text: '医技' },
        { value: 'D', text: '机关' },
        { value: 'P', text: '药房' },
        { value: 'N', text: '护士站' },
        { value: 'O', text: '其它' }
      ],
      deptPRODatas: [
        { value: '0', text: '普通' },
        { value: '1', text: '手术' },
        { value: '2', text: '麻醉' },
        { value: '3', text: 'ICU' },
        { value: '4', text: 'CCU' },
        { value: 'C', text: '产科' },
        { value: 'E', text: '急诊留观' },
        { value: 'T', text: '急诊' }
      ],
      DeptDatas: []
    }
  },
  created () {
    this.getDepartmentTree()
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    getDepartmentTree () {
      const $this = this
      getDepartmentPageData().then(res => {
        $this.DeptDatas.push({ title: 'root', value: 0, children: [], key: 0 })
        RecursionDict($this.DeptDatas[0], res.data)
      })
      // 递归字典
      function RecursionDict (obj, data) {
        data.forEach(element => {
          if (obj.value === element.PId) {
            if (obj.children === undefined) {
              obj.children = []
            }
            obj.children.push({ title: element.DeptName, value: element.Id, key: element.Id })
            RecursionDict(element, data)
          }
        })
      }
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            saveDepartment(values).then((res) => {
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
