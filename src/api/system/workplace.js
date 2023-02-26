import request from '@/utils/request'

const workplaceApi = {
  getSpecimenFollowData: '/Order/QuerySpecimenFollowData'
}
// 获取标本业务追踪信息
export function getSpecimenFollowData (pagination) {
    return request({
        url: workplaceApi.getSpecimenFollowData + '?pageIndex=' + pagination.current + '&pageSize=' + pagination.pageSize,
        method: 'get'
    })
}
