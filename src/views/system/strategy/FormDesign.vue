<template>
  <div>
    <a-space style="margin-bottom:10px;">
      选择模板：
      <a-select style="width: 220px;" @change="templateChange">
        <a-select-option v-for="province in this.templates" :key="province.text">
          {{ province.text }}
        </a-select-option>
      </a-select>
      模板名称：
      <a-input v-model="template.Name" style="width: 200px"/>
      模板代码：
      <a-input v-model="template.Code" style="width: 200px"/>
      业务目标：
      <a-select style="width: 220px;" v-model="template.TargetCode" @change="templateChange">
        <a-select-option value="Apply">申请单</a-select-option>
        <a-select-option value="Preview">申请单预览打印</a-select-option>
        <a-select-option value="OperationHelp">操作说明</a-select-option>
        <a-select-option value="ApplyExamItem">检查项目模板</a-select-option>
        <a-select-option value="Appointment">送检预约</a-select-option>
      </a-select>
      <a-button type="primary" icon="plus" @click="addTemplate">
        新增
      </a-button>
      <a-popconfirm placement="rightBottom" ok-text="是" cancel-text="否" @confirm="delTemplate">
        <template slot="title">
          <p>是否删除</p>
        </template>
        <a-button type="danger" icon="delete">
          删除
        </a-button>
      </a-popconfirm>
      <Help :helpTitle="''" :helpCode="'DesignOperationHelp'" :content="''"/>
    </a-space>
    <k-form-design ref="kfd" title="表单设计器" @save="handleSave"/>
  </div>
</template>
<script>
import ComponentInitializer from '@/core/components/componentRegistrar'
import { savePageTemplate, getPageTemplateData, delPageTemplate } from '@/api/system/pageTemplate'
import { CheckField, JSONStringToObject } from '@/utils/util'
import Help from '@/components/Help/HelpShowInfo'
const fieldData = [ 'batch', 'tabs', 'input', 'textarea', 'number', 'select', 'checkbox', 'radio', 'date', 'time', 'rate', 'slider', 'uploadFile', 'uploadImg', 'switch', 'button', 'alert', 'text', 'html', 'divider', 'card', 'grid', 'table' ]
export default {
  components: {
    Help
  },
  data () {
    return {
      templates: [],
      template: {},
      data: [],
      id: 0,
      fieldData
    }
  },
  created: function () {
    ComponentInitializer()
    this.initialize()
  },
  mounted () {
  },
  methods: {
    initialize () {
      this.data = []
      this.templates = []
      getPageTemplateData().then(res => {
        if (res) {
          this.data = res.data
          res.data.forEach(item => {
            this.templates.push({ 'text': item.Name, 'value': item.Id })
          })
        }
      })
    },
    delTemplate (val) {
      if (this.id === 0) {
        this.$message.warning('请选择删除模板', 2)
        return
      }
      delPageTemplate(this.id).then(res => {
        if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          this.initialize()
        } else {
          this.$message.warning(res.Message, 2)
        }
      })
    },
    addTemplate () {
      this.template = []
      this.data = []
      this.id = 0
      this.$refs.kfd.handleReset()
    },
    templateChange (val) {
      const obj = this.data.filter(f => f.Name === val)
      if (CheckField(obj)) {
        this.id = obj[0].Id
        this.template = obj[0]
        this.$refs.kfd.handleSetData(JSONStringToObject(obj[0].Content))
      }
    },
    handleSave (values) {
      if (CheckField(this.template.Name) === false) {
        this.$message.warning('不能为空', 2)
        return
      }
      const obj = { Id: this.id, Name: this.template.Name, Code: this.template.Code, TargetCode: this.template.TargetCode, Content: values, Status: 1, IsDefault: 1, Remark: '' }
      savePageTemplate(obj).then(res => {
        if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
          this.$message.success('操作成功！', 2)
          this.initialize()
        } else {
          this.$message.warning(res.Message, 2)
        }
      })
    }
  }
}
</script>
<style>
/* .ant-modal-root .ant-modal{
    width: 95% !important;
} */
</style>
