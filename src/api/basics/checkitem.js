import request from '@/utils/request'

const checkItemApi = {
    getCheckItemData: '/ExamItem/LoadData',
    saveCheckItem: '/ExamItem/Save',
    delCheckItem: '/ExamItem/Delete',
    insertCheckItem: '/ExamItem/Insert'
}
// 获取检查项目列表数据
export function getCheckItemData (key = '') {
    return request({
        url: checkItemApi.getCheckItemData + `?key=${key}`,
        method: 'get'
    })
}
// 保存检查项目
export function saveCheckItem (parameter) {
    return request({
        url: checkItemApi.saveCheckItem,
        method: 'post',
        data: parameter
    })
}
// 新增检查项目
export function insertCheckItem (parameter) {
    return request({
        url: checkItemApi.insertCheckItem,
        method: 'post',
        data: parameter
    })
}
// 删除检查项目
export function delCheckItem (id) {
    return request({
        url: checkItemApi.delCheckItem + `?id=${id}`,
        method: 'delete'
    })
}
