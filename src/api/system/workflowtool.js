import request from '@/utils/request'

const workflowtoolApi = {
    getSpecimenStatus: '/Order/QuerySpecimenStatus'
}
// 获取主流程列表数据
export function getSpecimenStatus () {
    return request({
        url: workflowtoolApi.getSpecimenStatus,
        method: 'get'
    })
}
