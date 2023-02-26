<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="12">
        <a-form-item label="菜单编码">
          <a-input v-decorator="['NodeCode', {rules: [{required: true, message: '请输入菜单编码'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="菜单名称">
          <a-input v-decorator="['NodeName', {rules: [{required: true, message: '请输入菜单名称'}]}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="父级菜单">
          <a-select v-decorator="['ParentCode', {initialValue: record.ParentCode}]" >
            <a-select-option v-for="d in parentMenuDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="页面Url">
          <a-input v-decorator="['PageUrl']" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-form-item label="Url参数">
          <a-input v-decorator="['UrlParams']" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="图标">
          <a-input v-decorator="['Icon']" />
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
import { saveMenu, getMenuData } from '@/api/system/menu'

const fields = ['Id', 'NodeCode', 'ParentCode', 'NodeName', 'Icon', 'SortOrder', 'PageUrl', 'UrlParams', 'Remark']
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
      parentMenuDatas: []
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
      getMenuData().then((res) => {
        res.data.forEach((item, i) => {
          if (item.ParentCode === null) {
            this.parentMenuDatas.push({
              value: item.NodeCode,
              text: item.NodeName
            })
          }
        })
      })
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            saveMenu(values).then((res) => {
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
