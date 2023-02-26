<template>
  <div>
    <a-form
      :form="form"
      class="strategyTemplateEdit"
      :layout="layout"
      :label-col="labelCol"
      :wrapper-col="wrapperCol">
      <a-form-item v-show="false" label="主键ID">
        <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
      </a-form-item>
      <a-row>
        <a-col :span="12">
          <a-form-item v-if="visible">
            基础模板：<a-select style="width: 200px" @change="templateChange">
              <a-select-option v-for="province in this.templates" :key="province.text">
                {{ province.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="">
            模板名称：<a-input v-decorator="['Name', {rules: [{required: true, message: '请输入模板名称'}]}]" style="width: 200px"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="">
            模板代码：<a-input v-decorator="['Code', {rules: [{required: true, message: '请输入模板代码'}]}]" style="width: 200px" :disabled="false" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="">
            业务目标：<a-select v-decorator="['TargetCode', {rules: [{required: true, message: '请选择业务目标'}]}]" style="width: 200px" @change="targetCodeChange">
              <a-select-option value="Preview">申请单预览</a-select-option>
              <a-select-option value="Apply">申请单</a-select-option>
              <a-select-option value="Static">静态模板</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="">
            模板状态：<a-radio-group v-decorator="['Status', {rules: [{required: true, message: '请选择模板状态'}]}]">
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
          <a-form-item label="">
            默认策略：<a-radio-group v-decorator="['IsDefault', {rules: [{required: true, message: '请选择默认策略'}]}]">
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
        <a-col :span="24">
          <a-form-item label="">
            备注信息：<a-textarea v-decorator="['Remark']"></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">
        属性配置
      </a-divider>
    </a-form>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="属性配置">
        <a-list>
          <a-list-item
            v-for="item in template.property"
            :key="item.key">
            <a-space>
              <span style="font-weight: bold;display: block;width:100px;">{{ item.ZNName }}</span>
              强制执行:<a-switch v-model="item.required" @change="requiredChange" />
              是否显示:<a-switch v-model="item.visible" @change="visibleChange" />
              默认:<a-input v-model="item.default" style="width: 100px" />
              类型:<a-select mode="combobox" placeholder="选项类型" style="width:100px;" v-model="item.type">
                <a-select-option v-for="d in enums.ObjectType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              正则:<a-input v-model="item.adaptive" style="width: 250px" />
            </a-space>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane key="2" tab="行为属性配置" force-render>
        <a-list>
          <a-list-item
            v-for="item in template.behaviorProperty"
            :key="item.key">
            <a-space>
              <span style="font-weight: bold;display: block;width:100px;">{{ item.ZNName }}</span>
              强制执行:<a-switch v-model="item.required" @change="requiredChange" />
              是否显示:<a-switch v-model="item.visible" @change="visibleChange" />
              默认:<a-input v-model="item.default" style="width: 100px" />
              类型:<a-select mode="combobox" placeholder="选项类型" style="width:100px;" v-model="item.type">
                <a-select-option v-for="d in enums.ObjectType" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
              </a-select>
              正则:<a-input v-model="item.adaptive" style="width: 250px" />
            </a-space>
          </a-list-item>
        </a-list>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { saveStrategyTemplate } from '@/api/system/strategy'
import { CheckField, JSONStringToObject, ObjectToJSONString } from '@/utils/util'
import { templateLocal } from '@/store/template/templates'
import enums from '@/store/enum/enum'
import { getPageTemplateData } from '@/api/system/pageTemplate'
import pick from 'lodash.pick'
const fields = ['Id', 'Name', 'Code', 'TargetCode', 'Status', 'IsDefault', 'Remark']
export default {
  name: 'StrategyTemplateEdit',
  components: {
  },
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      enums,
      fields,
      form: this.$form.createForm(this),
      template: {},
      templates: [],
      templateLocal,
      visible: false,
      layout: 'horizontal',
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 17
      }
    }
  },
  beforeCreate () {
  },
  created: function () {
    this.template = {}
    this.templates = []
    templateLocal.forEach(item => {
      this.templates.push({ 'text': item.text, 'value': item.value })
    })
    getPageTemplateData().then(res => {
      if (res) {
        res.data.forEach(item => {
          this.templates.push({ 'text': item.Name, 'value': item })
        })
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.template = this.record
      if (CheckField(this.record.Name) === true && this.record.TargetCode === 'Static') {
        const _property = JSONStringToObject(this.record.Content).property
        const _behaviorProperty = JSONStringToObject(this.record.Content).behaviorProperty
        const _propertys = this.templates.filter(f => f.text === this.record.Code)[0].value.property
        const _behaviorPropertys = this.templates.filter(f => f.text === this.record.Code)[0].value.behaviorProperty
        for (var item in _propertys) {
          const a = _property[item]
          if (CheckField(a) === false) {
            _property[item] = _propertys[item]
          }
          _property[item].type = _propertys[item].type
          switch (_property[item].type) {
            case 'bool':
              if (_property[item].default === true) {
                _property[item].default = 'true'
              } else if (_property[item].default === false) {
                _property[item].default = 'false'
              }
              break
          }
        }
        for (var item in _behaviorPropertys) {
          const a = _behaviorProperty[item]
          if (CheckField(a) === false) {
            _behaviorProperty[item] = _behaviorPropertys[item]
          }
          _behaviorProperty[item].type = _behaviorPropertys[item].type
        }
        this.template.property = _property
        this.template.behaviorProperty = _behaviorProperty
      } else {
        this.visible = true
      }
      this.form.setFieldsValue(pick(this.record, this.fields))
    })
  },
  computed: {
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            for (const item in this.template.property) {
              const obj = this.template.property[item]
              switch (obj.type) {
                case 'bool':
                  if (CheckField(obj.default) && obj.default === 'true') {
                    obj.default = true
                  } else if (CheckField(obj.default) && obj.default === 'false') {
                    obj.default = false
                  }
                  break
              }
              this.template.property[item] = obj
            }
          
            if (this.template.TargetCode === 'Static') {
              const _template = { Code: this.template.Code, Name: this.template.Name, property: this.template.property, behaviorProperty: this.template.behaviorProperty}
              values.Content = ObjectToJSONString(_template)
            } else {
              values.Content = this.template.Content
            }
            saveStrategyTemplate(values).then((res) => {
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
    targetCodeChange (val) {
      this.template.TargetCode = val
    },
    templateChange (val) {
      this.template = this.templates.filter(f => f.text === val)[0].value
    },
    requiredChange (val, a) {
      this.$nextTick(() => {
        const temp = this.template
        this.template = {}
        this.template = temp
      })
    },
    visibleChange () {
      this.$nextTick(() => {
        const temp = this.template
        this.template = {}
        this.template = temp
      })
    }
  }
}
</script>
<style>
.strategyTemplateEdit .ant-divider{
  margin: 5px 0;
}
.flag .ant-col-17 { width:100%;}
.strategyTemplateEdit .ant-row .ant-form-item{
 margin-bottom:5px;
}
.ant-modal-footer {
  z-index: 999999;
  position: sticky;
  bottom: 0px;
  background-color: #ffffff
}
</style>
