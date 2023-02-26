import request from '@/utils/request'

const messageApi = {
  getHisReqTypeConfigs: '/HisReqTypeConfig/GetHisReqTypeConfigs',
  saveHisReqTypeConfig: '/HisReqTypeConfig/SaveHisReqTypeConfig',
  delHisReqTypeConfig: '/HisReqTypeConfig/DelHisReqTypeConfig',
  getHisReqTypeByIp: '/HisReqTypeConfig/GetHisReqTypeByIp'
}
// 获取配置（根据客户端ip）
export function getHisReqTypeByIp () {
    return request({
        url: messageApi.getHisReqTypeByIp,
        method: 'get'
    })
}
// 获取数据
export function getHisReqTypeConfigs () {
    return request({
        url: messageApi.getHisReqTypeConfigs,
        method: 'get'
    })
}
// 删除数据
export function delHisReqTypeConfig (id) {
    return request({
        url: messageApi.delHisReqTypeConfig + '?id=' + id,
        method: 'delete'
    })
}
// 保存
export function saveHisReqTypeConfig (parameter) {
    return request({
        url: messageApi.saveHisReqTypeConfig,
        method: 'post',
        data: parameter
    })
}
