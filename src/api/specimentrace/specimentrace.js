import request from '@/utils/request'

const specimenTraceApi = {
    getPageData: '/SpecimenTrace/QueryPager',
    getSpecimenTrace: '/SpecimenTrace/QuerySpecimenTrace',
    searchDataByKey: '/SpecimenTrace/SearchDataByKey',
    getSpecimenFixedPager: '/SpecimenTrace/QuerySpecimenFixedPager',
    getSpecimenReceivePager: '/SpecimenTrace/QuerySpecimenReceivePager',
    getSpecimenSendPager: '/SpecimenTrace/QuerySpecimenSendPager'
}
// 获取标本列表数据
export function getPageData (parameter) {
    return request({
        url: specimenTraceApi.getPageData,
        method: 'post',
        data: parameter
    })
}
// 获取标本固定时间异常列表数据
export function getSpecimenFixedPager (parameter) {
    return request({
        url: specimenTraceApi.getSpecimenFixedPager,
        method: 'post',
        data: parameter
    })
}
// 获取标本接收时间异常列表数据
export function getSpecimenReceivePager (parameter) {
    return request({
        url: specimenTraceApi.getSpecimenReceivePager,
        method: 'post',
        data: parameter
    })
}
// 获取标本运送时间异常列表数据
export function getSpecimenSendPager (parameter) {
    return request({
        url: specimenTraceApi.getSpecimenSendPager,
        method: 'post',
        data: parameter
    })
}
// 获取标本追踪记录
export function getSpecimenTrace (id) {
    return request({
        url: specimenTraceApi.getSpecimenTrace + `?id=${id}&sendId=`
    })
}
// 根据关键字获取数据
export function searchDataByKey (key, type) {
    return request({
        url: specimenTraceApi.searchDataByKey + `?key=${key}&type=${type}`
    })
}
