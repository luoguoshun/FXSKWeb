import request from '@/utils/request'

const registerApi = {
    guerySpecimenCheckInData: '/Order/QuerySpecimenCheckInData',
    scanCheckInSpecimens: '/Order/ScanCheckInSpecimens'
}
// 扫码登记
export function scanCheckInSpecimens (parameter) {
    return request({
        url: registerApi.scanCheckInSpecimens,
        method: 'post',
        data: parameter
    })
}
// 获取登记数据
export function guerySpecimenCheckInData (pageIndex, pageSize, status) {
    return request({
        url: registerApi.guerySpecimenCheckInData + `?page=${pageIndex}&limit=${pageSize}&status=${status}`,
        method: 'get'
    })
}
