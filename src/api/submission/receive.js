import request from '@/utils/request'
import moment from 'moment'

const receiveApi = {
  getyReceiveSendPackages: '/Order/QueryReceiveSendPackages',
  getPackageSpecimensById: '/Order/GetPackageSpecimensById',
  getPackageSpecimensBySpecimenId: '/Order/GetPackageSpecimensBySpecimenId',
  getPackageSpecimensByAppOrderId: 'Order/GetPackageSpecimensByAppOrderId',
  doReceive: '/Order/DoReceive',
  doReturn: '/Order/doReturn',
  verifySender: '/Order/VerifySender'
}
// 获取已打包数据
export function getyReceiveSendPackages (filter, pageIndex, pageSize) {
    let startDate = ''
    let endDate = ''
    if (filter.startDate !== '' && filter.startDate !== null) {
        startDate = moment(filter.startDate).format('YYYY-MM-DD')
    }
    if (filter.endDate !== '' && filter.endDate !== null) {
        endDate = moment(filter.endDate).format('YYYY-MM-DD')
    }
    return request({
        url: receiveApi.getyReceiveSendPackages + `?sendNo=${filter.sendNo}&sendStatus=${filter.sendStatus}&startDate=${startDate}&endDate=${endDate}&page=${pageIndex}&limit=${pageSize}&isSend=false`,
        method: 'get'
    })
}
// 验证实际运送人员工号和打包运送人员工号一致
export function verifySender (senderNO, sendNo) {
    return request({
        url: receiveApi.verifySender + `?senderNO=${senderNO}&sendNo=${sendNo}`,
        method: 'get'
    })
}
// 根据打包Id获取标本信息
export function getPackageSpecimensById (id) {
    return request({
        url: receiveApi.getPackageSpecimensById + `?id=${id}`,
        method: 'get'
    })
}
// 根据标本Id获取标本信息
export function getPackageSpecimensBySpecimenId (id) {
  return request({
      url: receiveApi.getPackageSpecimensBySpecimenId + `?id=${id}`,
      method: 'get'
  })
}
// 根据申请单Id获取标本信息
export function getPackageSpecimensByAppOrderId (id) {
  return request({
      url: receiveApi.getPackageSpecimensByAppOrderId + `?id=${id}`,
      method: 'get'
  })
}
// 接收
export function doReceive (parameter) {
    return request({
        url: receiveApi.doReceive,
        method: 'post',
        data: parameter
    })
}
// 退回
export function doReturn (parameter) {
    return request({
        url: receiveApi.doReturn,
        method: 'post',
        data: parameter
    })
}
