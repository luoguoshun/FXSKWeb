import request from '@/utils/request'

const messageApi = {
  getPrintConfigs: '/PrintConfig/GetPrintConfigs',
  savePrintConfig: '/PrintConfig/SavePrintConfig',
  delPrintConfig: '/PrintConfig/DelPrintConfig'
}
// 获取数据
export function getPrintConfigs () {
    return request({
        url: messageApi.getPrintConfigs,
        method: 'get'
    })
}
// 删除数据
export function delPrintConfig (id) {
    return request({
        url: messageApi.delPrintConfig + '?id=' + id,
        method: 'delete'
    })
}
// 保存
export function savePrintConfig (parameter) {
    return request({
        url: messageApi.savePrintConfig,
        method: 'post',
        data: parameter
    })
}
