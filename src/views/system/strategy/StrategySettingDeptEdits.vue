<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id']" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="11">
        <a-form-item label="模板">
          <a-select v-decorator="['Template', {rules: [{required: true, message: '请选择模板'}]}]">
            <a-select-option v-for="item in templates" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="11">
        <a-form-item label="类型">
          <a-select v-decorator="['Type', {rules: [{required: true, message: '请选择类型'}]}]">
            <a-select-option :value="1">
              操作科室
            </a-select-option>
            <a-select-option :value="2">
              送检科室
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
      <a-col :span="2"></a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="部门">
          <a-card :label-col="24">
            <a-tree
              v-model="checkedKeys"
              checkable
              :showLine="true"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="false"
              :selected-keys="selectedKeys"
              :tree-data="treeData"
              @select="onSelect"
              @expand="onExpand"
            />
          </a-card>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { getDepartmentData } from '@/api/basics/department'
import { getStrategyTemplateData, saveStrategy } from '@/api/system/strategy'
import pick from 'lodash.pick'
const fields = ['Id', 'Department', 'Template', 'Status', 'Type', 'Depts']
const treeData = [
  { title: '根', key: '0', Id: null, children: [] }
]
export default {
  name: 'StrategySettingDeptEdit',
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
      expandedKeys: ['0'],
      checkedKeys: [],
      selectedKeys: [],
      treeData,
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
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            values.Depts = this.checkedKeys.join(',')
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
      getDepartmentData().then(res => {
        // res.data.forEach(item => {
        //   this.departments.push({ 'text': item.DeptName, 'value': item.Id })
        // })
        this.treeData = [
          { title: '根', key: '0', Id: 0, children: [] }
        ]
        RecursionMenu(this.treeData[0], res.data)
        
        // 递归菜单
        function RecursionMenu (obj, data) {
          data.forEach(element => {
            if (obj.Id === element.PId) {
              if (obj.children.length === 0) {
                obj.children = []
              }
              const childObj = { title: element.DeptName, key: element.Id.toString(), Id: element.Id, children: [] }
              obj.children.push(childObj)
              RecursionMenu(childObj, data)
            }
          })
        }
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
