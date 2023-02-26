<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="12">
        <a-form-item label="部位系统">
          <a-tree-select
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="partsDatas"
            placeholder="Please select"
            tree-default-expand-all
            v-decorator="['ParentId', {rules: [{required: true, message: '请输入部位系统'}]}, {initialValue: record.ParentId}]"
          >
          </a-tree-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="SrcPartId">
          <a-input v-decorator="['SrcPartId', {rules: [{required: true, message: '请输入SrcPartId'}]}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="部位名称">
          <a-input v-decorator="['Content', {rules: [{required: true, message: '请输入部位名称'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="排序">
          <a-input-number name="SortOrder" :min="1" :max="100" v-decorator="['SortOrder', {initialValue: 1}]"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="状态">
          <a-radio-group name="Status" v-decorator="['Status', {initialValue: (Number(record.Status) >= 0 ? Number(record.Status):1)}]">
            <a-radio :value="0">
              系统自带
            </a-radio>
            <a-radio :value="1">
              人工输入
            </a-radio>
          </a-radio-group>
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
import { saveCheckPart, getCheckPartData, insertCheckPart } from '@/api/basics/checkpart'

const fields = ['Id', 'Content', 'SrcPartId', 'ParentId', 'Icon', 'SortOrder', 'PageUrl', 'UrlParams', 'Remark']
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
      partsDatas: []
    }
  },
  created () {
    this.getCheckPartData()
  },
  mounted () {
    this.$nextTick(() => {
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    getCheckPartData () {
      const $this = this
      getCheckPartData().then((res) => {
        $this.partsDatas.push({ title: 'root', value: 0, children: [] })
        res.data.forEach((item, index) => {
          item.key = index + 1
          if (item.ParentId === 0) {
            item = { title: item.Content, value: item.Id }
            $this.partsDatas[0].children.push(item)
          }
        })
        // RecursionDict($this.partsDatas[0], res.data)
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
    onCancel () {
      this.sourceData = []
      this.targetKeys = []
      return new Promise(resolve => {
        resolve(true)
      })
    },
    save (values, resolve) {
      saveCheckPart(values).then((res) => {
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
      insertCheckPart(values).then((res) => {
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
