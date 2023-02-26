import request from '@/utils/request'

const dictApi = {
    getDictData: '/SysDict/LoadData',
    saveDict: '/SysDict/Save',
    delDict: '/SysDict/Delete',
    getDictByName: '/SysDict/GetDictByName',
    savePrintTemplet: '/SysDict/SavePrintTemplet',
    getPrintTempDicts: '/SysDict/GetPrintTempDicts',
    delPrintTempDicts: '/SysDict/DelPrintTempDicts',
    getPathologyTypes: '/SysDict/GetPathologyTypes'
}
// 获取送检类型
export function getPathologyTypes () {
    return request({
        url: dictApi.getPathologyTypes,
        method: 'get'
    })
}
// 获取列表数据
export function getDictData (name = '') {
    return request({
        url: dictApi.getDictData + `?name=${name}`,
        method: 'get'
    })
}
// 依据字典名称获取字典数据数据
export function getDictByName (name) {
    return request({
        url: dictApi.getDictByName + `?name=${name}`,
        method: 'get'
    })
}
// 保存
export function saveDict (parameter) {
    return request({
        url: dictApi.saveDict,
        method: 'post',
        data: parameter
    })
}
// 保存打印模板
export function savePrintTemplet (parameter) {
    return request({
        url: dictApi.savePrintTemplet,
        method: 'post',
        data: parameter
    })
}
// 获取打印模板数据
export function getPrintTempDicts () {
    return request({
        url: dictApi.getPrintTempDicts,
        method: 'get'
    })
}
// 删除打印模板
export function delPrintTempDicts (id) {
    return request({
        url: dictApi.delPrintTempDicts + '?id=' + id,
        method: 'delete'
    })
}
// 删除
export function delDict (id) {
    return request({
        url: dictApi.delDict + '?id=' + id,
        method: 'delete'
    })
}
