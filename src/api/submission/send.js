import request from '@/utils/request'

const sendApi = {
  sendPackages: '/Order/SendPackages',
  getSendPackagesSpecimens: '/Order/GetSendPackagesSpecimens'
}
// 发送
export function sendPackages (parameter) {
    return request({
        url: sendApi.sendPackages,
        method: 'post',
        data: parameter
    })
}
// 送出标本查询
export function getSendPackagesSpecimens (ids) {
    return request({
        url: sendApi.getSendPackagesSpecimens + `?ids=${ids}`,
        method: 'get'
    })
}
