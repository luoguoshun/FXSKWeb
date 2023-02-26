<template>
  <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-form-item label="角色名">
      <a-input v-decorator="['RoleName', {rules: [{required: true, message: '角色名'}]}]" />
    </a-form-item>
    <a-form-item label="备注">
      <a-textarea v-decorator="['Remark']"></a-textarea>
    </a-form-item>
    <a-row>
      <a-col :span="24">
        <a-form-item label="菜单权限">
          <a-card :label-col="20">
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
import pick from 'lodash.pick'
import { saveRole } from '@/api/system/role'
import { getMenuData } from '@/api/system/menu'
const treeData = [
  { title: '根', key: '0', NodeCode: null, children: [] }
]
const fields = ['RoleName', 'Remark']
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
      form: this.$form.createForm(this),
      MenuIDs: '',
      expandedKeys: ['0'],
      checkedKeys: [],
      selectedKeys: [],
      treeData
    }
  },
  created () {
    getMenuData().then((res) => {
      this.treeData = [
        { title: '根', key: '0', NodeCode: null, children: [] }
      ]
      RecursionMenu(this.treeData[0], res.data)
      this.checkedKeys = this.record.MenuIDs.split(',')
    })
    // 递归菜单
    function RecursionMenu (obj, data) {
      data.forEach(element => {
        if (obj.NodeCode === element.ParentCode) {
          if (obj.children.length === 0) {
            obj.children = []
          }
          const childObj = { title: element.NodeName, key: element.Id.toString(), NodeCode: element.NodeCode, children: [] }
          obj.children.push(childObj)
          RecursionMenu(childObj, data)
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
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
            values.MenuIDs = this.checkedKeys.join(',')
            saveRole(values).then((res) => {
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
