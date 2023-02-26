import request from '@/utils/request'

const orderApi = {
  queryPager: '/Statistic/QueryPager',
  getOrderAndSpecimenTotal: '/Statistic/QueryOrderAndSpecimenTotal',
  getSendPacks: '/Statistic/QuerySendPacks'
}
// 获取打包统计数据
export function getSendPacks (pagination, filter) {
    return request({
        url: orderApi.getSendPacks + `?department=${filter.department}&sendNo=${filter.sendNo}&sendStatus=${filter.sendStatus}&startDate=${filter.startDate}&endDate=${filter.endDate}&page=${pagination.current}&limit=${pagination.pageSize}`,
        method: 'get'
    })
}
// 获取申请单统计数据
export function getOrderData (pagination, filters) {
    return request({
        url: orderApi.queryPager + `?department=${filters.department}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${pagination.current}&limit=${pagination.pageSize}`,
        method: 'get'
    })
}
// 获取申请单、标本数量
export function getOrderAndSpecimenTotal () {
    return request({
        url: orderApi.getOrderAndSpecimenTotal,
        method: 'get'
    })
}
