import request from '@/utils/request'
const api = {
    getPageTemplateData: '/PageTemplate/LoadData',
    savePageTemplate: '/PageTemplate/Save',
    delPageTemplate: '/PageTemplate/Delete',
    getTemplateByCode: '/PageTemplate/QueryTemplateByCode'
}
// 获取列表数据
export function getPageTemplateData (name = '') {
    return request({
        url: api.getPageTemplateData + `?name=${name}`,
        method: 'get'
    })
}
// 根据代码获取数据
export function getTemplateByCode (code = '') {
    return request({
        url: api.getTemplateByCode + `?code=${code}`,
        method: 'get'
    })
}
// 删除模板
export function delPageTemplate (id) {
    return request({
        url: api.delPageTemplate + '?id=' + id,
        method: 'delete'
    })
}
// 保存模板
export function savePageTemplate (parameter) {
    return request({
        url: api.savePageTemplate,
        method: 'post',
        data: parameter
    })
}
