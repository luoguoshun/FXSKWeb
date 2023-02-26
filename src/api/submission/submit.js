import request from '@/utils/request'

const collectApi = {
    getSpecimenConfirmData: '/Order/QuerySpecimenConfirmData',
    submitApp: '/Order/SubmitApp'
}
// 提交
export function submitApp (parameter) {
    return request({
        url: collectApi.submitApp,
        method: 'post',
        data: parameter
    })
}
// 获取可提交数据
export function getSpecimenConfirmData (pageIndex, pageSize, status, type='', id=0) {
    return request({
        url: collectApi.getSpecimenConfirmData + `?page=${pageIndex}&limit=${pageSize}&status=${status}&type=${type}&id=${id}`,
        method: 'get'
    })
}
