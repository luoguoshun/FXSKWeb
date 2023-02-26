import request from '@/utils/request'

const menuApi = {
    getMenuData: '/SysMenu/LoadData',
    saveMenu: '/SysMenu/Save',
    delMenu: '/SysMenu/Delete',
    checkMenuExists: '/SysMenu/CheckMenuExists'
}
// 获取菜单列表数据
export function getMenuData () {
    return request({
        url: menuApi.getMenuData,
        method: 'get'
    })
}
// 检测流程是否存在
export function checkMenuExists (code, name) {
    return request({
        url: menuApi.checkMenuExists + `?nodeCode=${encodeURIComponent(code, 'utf-8')}&nodeName=${name}`,
        method: 'get'
    })
}
// 保存菜单
export function saveMenu (parameter) {
    return request({
        url: menuApi.saveMenu,
        method: 'post',
        data: parameter
    })
}
// 删除菜单
export function delMenu (id) {
    return request({
        url: menuApi.delMenu + '?id=' + id,
        method: 'delete'
    })
}
