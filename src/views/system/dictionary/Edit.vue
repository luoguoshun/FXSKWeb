<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="12">
        <a-form-item label="字典名称">
          <a-input v-decorator="['Name', {rules: [{required: true, message: '请输入字典名称'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="字典类型">
          <a-select v-decorator="['Type', {initialValue: record.Type}]" >
            <a-select-option v-for="d in typeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
          <!-- <a-input v-decorator="['Type', {rules: [{required: true, message: '请输入字典类型'}]}]" /> -->
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="父菜单">
          <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="parentMenuDatas"
            placeholder="Please select"
            tree-default-expand-all
            v-decorator="['ParentId', {initialValue: record.ParentId}]"
          >
          </a-tree-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="字典内容">
          <a-input v-decorator="['Content']" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
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
import { getDictData, saveDict } from '@/api/system/dictionary'

const fields = ['Id', 'ParentId', 'Name', 'Type', 'Content', 'Status', 'SortOrder', 'Remark']
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
      parentMenuDatas: [],
      typeDatas: [{ value: 'SystemSettings', text: 'SystemSettings' }, { value: 'PrintTemplet', text: 'PrintTemplet' }, { value: 'DataItem', text: 'DataItem' }]
    }
  },
  created () {
    this.loadParentMenu()
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    loadParentMenu () {
      const $this = this
      getDictData()
      .then((res) => {
        res.data.push({ Name: 'root', Id: -1 })
        res.data.forEach((item, index) => {
          item.key = index + 1
          if (item.Id === -1) {
            item = { title: item.Name, value: item.Id }
            $this.parentMenuDatas.push(item)
          }
        })
        RecursionDict($this.parentMenuDatas[0], res.data)
      })
      // 递归字典
      function RecursionDict (obj, data) {
        data.forEach(element => {
          if (obj.value === element.ParentId) {
            if (obj.children === undefined) {
              obj.children = []
            }
            element = { title: element.Name, value: element.Id }
            obj.children.push(element)
            RecursionDict(element, data)
          }
        })
      }
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            saveDict(values).then((res) => {
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
