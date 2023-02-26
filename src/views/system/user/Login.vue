<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误"/>
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="请输入帐户名"
              v-decorator="[
                'LoginName',
                {rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              placeholder="请输入密码"
              v-decorator="[
                'LoginPwd',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item v-if="CASrc !== ''" style="margin-bottom: 5px;">
        <a @click="CALogin">CA登录</a>
      </a-form-item>

      <a-form-item style="margin-top:0px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>

    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
// import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { Scaner } from '@/utils/scan'
import { getDictByName } from '@/api/system/dictionary'
import storage from 'store'
import {
  getToken,
} from '@/api/submission/app'
export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      CASrc: '',
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false,
        msg: ''
      }
    }
  },
  created () {
    Scaner(this.scanCallBack)
  },
  mounted () {
    this.CASrc = storage.get('CASrc')
  },
  methods: {
    scanCallBack (code) {
      const {
        state,
        Login
      } = this
      const a = code.split(' ')
      Login({ 'LoginName': a[0], 'LoginPwd': a[1] })
        .then((res) => {
          this.loginSuccess(res)
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {
          state.loginBtn = false
        })
    },
    ...mapActions(['Login', 'Logout', 'getUserInfoByCAKey']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['LoginName', 'LoginPwd'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          delete loginParams.LoginName
          loginParams[!state.loginType ? 'email' : 'LoginName'] = values.LoginName
          loginParams.LoginPwd = values.LoginPwd
          loginParams.LoginName = window.btoa(loginParams.LoginName)
          loginParams.LoginPwd = window.btoa(loginParams.LoginPwd)
          Login(loginParams)
            .then((res) => {
              this.loginSuccess(res)
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      if (res) {
        this.msg = res.msg
        this.isLoginError = true
        return
      }
      this.$router.push({ path: '/' })
      this.isLoginError = false
    },
    requestFailed () {
      this.isLoginError = true
    },
    CALogin() {
      if (this.CASrc === '' || this.CASrc === undefined) {
        return
      }
      const array = this.CASrc.split('|')
      //可配置在字典值里面
      const req = {
        url: array[0], //接口地址
        businessOrgCode: array[1], //组织机构代码
        businessSystemCode: array[2], //业务系统编码
        businessSystemAppID: array[3], //业务系统唯一标识
      }
      //同步，这里会等待中间件完成登录
      const loginResult = caApi.SZWJ_LoginByComponents(req)
      console.log(loginResult, 'CA登录结果')
      if (loginResult.statusCode != 0) {
        PromptBox('CA中间件登录失败', 'warning', 'topRight', 2)
        return
      }

      //验证登录并获取token
      req.authority = loginResult.eventValue.authority //授权服务器
      req.signCert = loginResult.eventValue.signCert //base64 编码格式证书
      req.boundValue = loginResult.eventValue.boundValue //登录签名值
      req.authServerAddr = loginResult.eventValue.authServerAddr //授权服务器

      //从后台获取CA Token
      getToken(req).then((res) => {
          if(!res){
            PromptBox('CA获取不到Token', 'warning', 'topRight', 2)
            return
          }
          
          req.token = res
          const imgResult = caApi.SZWJ_GetPicBySN(req)
          if (imgResult.statusCode != 0) {
            PromptBox('CA中间件获取签名图像失败', 'warning', 'topRight', 2)
            return
          }
          var imgStr=imgResult.eventValue.dictionary[0].signFlow
          this.DoctorCode=imgResult.eventValue.dictionary[0].signName
          
          getUserInfoByCAKey(this.DoctorCode).then((res) => {
            if (res.ResultType !== 1) {
              PromptBox(res.Message, 'warning', 'topRight', 2)
            } else {
              this.$router.push({ path: '/dashboard/workplace' })
            }
          })
          .catch(err => this.requestFailed(err))
          .finally(() => {
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
