import request from '@/utils/request'

const checkPartApi = {
    getCheckPartData: '/OrganParts/LoadData',
    saveCheckPart: '/OrganParts/Save',
    delCheckPart: '/OrganParts/Delete',
    insertCheckPart: '/OrganParts/Insert'
}
// 获取检查部位列表数据
export function getCheckPartData (key) {
    if (key === undefined) {
      key = ''
    }
    return request({
        url: checkPartApi.getCheckPartData + `?key=${key}`,
        method: 'get'
    })
}
// 保存检查部位
export function saveCheckPart (parameter) {
    return request({
        url: checkPartApi.saveCheckPart,
        method: 'post',
        data: parameter
    })
}
// 新增检查部位
export function insertCheckPart (parameter) {
    return request({
        url: checkPartApi.insertCheckPart,
        method: 'post',
        data: parameter
    })
}
// 删除检查部位
export function delCheckPart (id) {
    return request({
        url: checkPartApi.delCheckPart + `?id=${id}`,
        method: 'delete'
    })
}
