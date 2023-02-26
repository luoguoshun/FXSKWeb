<template>
  <a-card>
    <a-form :form="form" :layout="layout" :label-col="labelCol" :wrapper-col="wrapperCol" @submit="handleSubmit">
      <a-row>
        <a-col :span="10">
          <a-form-item label="原密码">
            <a-input-password
              placeholder="请输入原密码"
              v-decorator="[
                'OldLoginPwd',
                {rules: [{ required: true, message: '请输入原密码' }]}
              ]"
            >
            </a-input-password>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="10">
          <a-form-item label="新密码">
            <a-input-password
              placeholder="请输入新密码"
              v-decorator="[
                'NewLoginPwd',
                {rules: [{ required: true, message: '请输入新密码' }]}
              ]"
            >
            </a-input-password>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="10">
          <a-form-item label="确认密码">
            <a-input-password
              placeholder="请确认新密码"
              v-decorator="[
                'CheckLoginPwd',
                {rules: [{ required: true, message: '请确认新密码' }]}
              ]"
            >
            </a-input-password>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit">
              确定
            </a-button>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import { changeLoginPwd } from '@/api/system/user'
import store from '@/store'
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
        span: 5
      },
      wrapperCol: {
        span: 19
      },
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    handleSubmit (e) {
      const $this = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.CheckLoginPwd !== values.NewLoginPwd) {
            $this.$message.warning('两次密码不一致，请确认！')
            return
          }
          changeLoginPwd({ 'logingName': '', 'oldLoginPwd': values.OldLoginPwd, 'newLoginPwd': values.NewLoginPwd }).then(res => {
            if (res && res.HttpStatusCode === 200 && res.ResultType === 1) {
              this.$message.success('操作成功！', 2)
              store.dispatch('Logout').then(() => {
                this.$router.push({ path: '/user/login' })
              })
            } else {
              this.$message.warning(res.Message, 2)
            }
          })
        }
      })
    }
  }
}
</script>
