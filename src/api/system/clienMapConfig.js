import request from '@/utils/request'
const strategyApi = {
    getClienMapConfigData: '/ClienMapConfig/LoadData',
    saveClienMapConfig: '/ClienMapConfig/Save',
    delClienMapConfig: '/ClienMapConfig/Delete'
}
// 获取列表数据
export function getClienMapConfigData (name = '') {
    return request({
        url: strategyApi.getClienMapConfigData + `?name=${name}`,
        method: 'get'
    })
}
// 删除策略模板
export function delClienMapConfig (id) {
    return request({
        url: strategyApi.delClienMapConfig + '?id=' + id,
        method: 'delete'
    })
}
// 保存策略模板
export function saveClienMapConfig (parameter) {
    return request({
        url: strategyApi.saveClienMapConfig,
        method: 'post',
        data: parameter
    })
}
