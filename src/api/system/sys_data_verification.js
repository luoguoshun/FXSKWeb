import request from '@/utils/request'

const sysVerificationApi = {
  getVerificationDict: '/SysConfigDataVerification/VerificationDict'
}
// 获取系统配置数据校验结果
export function getVerificationDict () {
    return request({
        url: sysVerificationApi.getVerificationDict,
        method: 'get'
    })
}
