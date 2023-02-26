import request from '@/utils/request'

const roleApi = {
  getRoleData: '/SysRole/LoadData',
    saveRole: '/SysRole/Save',
    delRole: '/SysRole/Delete'
}
// 获取角色数据
export function getRoleData () {
    return request({
        url: roleApi.getRoleData,
        method: 'get'
    })
}
// 保存角色
export function saveRole (parameter) {
    return request({
        url: roleApi.saveRole,
        method: 'post',
        data: parameter
    })
}
// 删除角色
export function delRole (id) {
    return request({
        url: roleApi.delRole + '?id=' + id,
        method: 'delete'
    })
}
