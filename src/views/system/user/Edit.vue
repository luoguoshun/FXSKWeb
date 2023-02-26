<template>
  <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol">
    <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
    <a-form-item v-show="false" label="主键ID">
      <a-input v-decorator="['Id', { initialValue: record.Id }]" disabled />
    </a-form-item>
    <a-row>
      <a-col :span="7">
        <a-form-item label="登录账户">
          <a-input v-decorator="['LoginName', {rules: [{required: true, message: '请输入登录账户'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="1"></a-col>
      <a-col :span="7">
        <a-form-item label="登录密码">
          <a-input-password
            placeholder="请输入密码"
            v-decorator="[
              'LoginPwd',
              {rules: [{ required: true, message: '请输入密码' }]}
            ]"
          >
          </a-input-password>
        </a-form-item>
      </a-col>
      <a-col :span="1"></a-col>
      <a-col :span="7">
        <a-form-item label="用户姓名">
          <a-input v-decorator="['UserName', {rules: [{required: true, message: '请输入姓名'}]}]" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="7">
        <a-form-item label="用户工号">
          <a-input v-decorator="['UserCode', {rules: [{required: true, message: '请输入工号'}]}]" />
        </a-form-item>
      </a-col>
      <a-col :span="1"></a-col>
      <a-col :span="7">
        <a-form-item label="简称">
          <a-input v-decorator="['NickName']" />
        </a-form-item>
      </a-col>
      <a-col :span="1"></a-col>
      <a-col :span="7">
        <a-form-item label="科室">
          <a-select v-decorator="['Department', {initialValue: record.Department}]" >
            <a-select-option v-for="d in departmentDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="7">
        <a-form-item label="用户类型">
          <a-select v-decorator="['UserType', {initialValue: record.UserType}]" >
            <a-select-option v-for="d in userTypeDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="1"></a-col>
      <a-col :span="7">
        <a-form-item label="职称">
          <a-select v-decorator="['Title', {initialValue: record.Title}]" >
            <a-select-option v-for="d in titleDatas" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="1"></a-col>
      <a-col :span="7">
        <a-form-item label="手机号码">
          <a-input v-decorator="['MobileNo']" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="7">
        <a-form-item label="电子邮箱">
          <a-input v-decorator="['Email']" />
        </a-form-item>
      </a-col>
      <a-col :span="1"></a-col>
      <a-col :span="7">
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
      <a-col :span="1"></a-col>
      <a-col :span="7">
        <a-form-item label="性别">
          <a-radio-group name="Sex" v-decorator="['Sex', {initialValue: (Number(record.Sex) >= 0 ? Number(record.Sex):0)}]">
            <a-radio :value="0">
              男
            </a-radio>
            <a-radio :value="1">
              女
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="用户角色" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
          <a-select
            v-decorator="['Roles', {initialValue: record.Roles}]"
            mode="multiple"
            placeholder=""
            style="width: 100%"
            @change="handleChange"
          >
            <a-select-option v-for="item in roleNamesDatas" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="备注" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
          <a-textarea v-decorator="['Remark']"></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="CAKey" :label-col="{ span: 2 }" :wrapper-col="{ span: 21 }">
          <a-textarea v-decorator="['CAKey']"></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { saveSysUser } from '@/api/system/user'
import { getDepartmentData } from '@/api/basics/department'
import { getRoleData } from '@/api/system/role'

const fields = ['LoginName', 'UserCode', 'UserName', 'Remark', 'LoginPwd', 'CAKey']
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
        span: 7
      },
      wrapperCol: {
        span: 17
      },
      form: this.$form.createForm(this),
      departmentDatas: [],
      roleNamesDatas: [],
      titleDatas: [
        { value: '初级', text: '初级' },
        { value: '中级', text: '中级' },
        { value: '副高级', text: '副高级' },
        { value: '正级', text: '正级' }
        ],
      userTypeDatas: [
        { value: '系统管理员', text: '系统管理员' },
        { value: '医生', text: '医生' },
        { value: '护士', text: '护士' },
        { value: '运送人员', text: '运送人员' },
        { value: '技术员', text: '技术员' },
        { value: '特殊运送人员', text: '特殊运送人员' },
        { value: '体检人员', text: '体检人员' },
        { value: '其它', text: '其它' }
        ]
    }
  },
  created () {
    this.loadDepartmentData()
    this.getRoleData()
  },
  mounted () {
    this.$nextTick(() => {
      if (this.record.RoleIds !== undefined && this.record.RoleIds !== null) {
        const roleIds = this.record.RoleIds.split(',')
        this.record.Roles = this.turnNum(roleIds)
      } else {
        this.record.Roles = []
      }
      this.form.setFieldsValue(pick(this.record, fields))
    })
  },
  methods: {
    turnNum (roleIds) {
      for (let i = 0; i < roleIds.length; i++) {
        roleIds[i] = parseInt(roleIds[i])
      }
      return roleIds
    },
    getRoleData () {
      getRoleData().then((res) => {
        res.data.forEach((item, i) => {
          this.roleNamesDatas.push({
            value: item.Id,
            text: item.RoleName
          })
        })
      })
    },
    loadDepartmentData () {
      getDepartmentData().then((res) => {
        res.data.forEach((item, i) => {
          this.departmentDatas.push({
            value: item.DeptCode,
            text: item.DeptName
          })
        })
      })
    },
    onOk () {
      return new Promise(resolve => {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            values.RoleIds = values.Roles.join(',')
            saveSysUser(values).then((res) => {
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
