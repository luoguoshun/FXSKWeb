import request from '@/utils/request'
const strategyApi = {
    getStrategyTemplateData: '/Strategy/LoadData',
    saveStrategyTemplate: '/Strategy/Save',
    delStrategyTemplate: '/Strategy/Delete',
    getTemplateByCode: '/Strategy/QueryTemplateByCode',
    getStrategyData: '/Strategy/LoadStrategyData',
    getStrategyByType: '/Strategy/QueryStrategyByType',
    saveStrategy: '/Strategy/SaveStrategy',
    delStrategy: '/Strategy/DeleteStrategy',
    getStrategyTemplate: '/Strategy/QueryStrategyTemplate',
    recallAppOrder: '/ImplementationTool/RecallAppOrder',
    updStrategyDefault: '/Strategy/UpdStrategyDefault'
} 
// 回滚申请单
export function recallAppOrder (parameter) {
    return request({
        url: strategyApi.recallAppOrder,
        method: 'post',
        data: parameter
    })
}
// 获取列表数据
export function getStrategyTemplateData (name = '') {
    return request({
        url: strategyApi.getStrategyTemplateData + `?name=${name}`,
        method: 'get'
    })
}
// 根据代码获取数据
export function getTemplateByCode (code = '') {
    return request({
        url: strategyApi.getTemplateByCode + `?code=${code}`,
        method: 'get'
    })
}
// 删除策略模板
export function delStrategyTemplate (id) {
    return request({
        url: strategyApi.delStrategyTemplate + '?id=' + id,
        method: 'delete'
    })
}
// 保存策略模板
export function saveStrategyTemplate (parameter) {
    return request({
        url: strategyApi.saveStrategyTemplate,
        method: 'post',
        data: parameter
    })
}
// 获取策略列表数据
export function getStrategyData (key = '', targetType = 'dept', type = 1) {
    return request({
        url: strategyApi.getStrategyData + `?key=${key}&targetType=${targetType}&type=${type}`,
        method: 'get'
    })
}
// 获取策略列表数据
export function getStrategyDataByType (type = 1) {
    return request({
        url: strategyApi.getStrategyByType + `?type=${type}`,
        method: 'get'
    })
}
// 获取用户策略模板
export function getStrategyTemplate (code) {
    return request({
        url: strategyApi.getStrategyTemplate + '?code=' + code,
        method: 'get'
    })
}
// 删除策略
export function delStrategy (id) {
    return request({
        url: strategyApi.delStrategy + '?id=' + id,
        method: 'delete'
    })
}
// 保存策略
export function saveStrategy (parameter) {
    return request({
        url: strategyApi.saveStrategy,
        method: 'post',
        data: parameter
    })
}
// 修改默认策略
export function updStrategyDefault (parameter) {
    return request({
        url: strategyApi.updStrategyDefault,
        method: 'post',
        data: parameter
    })
}
