import request from '@/utils/request'

const userApi = {
    getSysUserData: '/SysUser/LoadData',
    saveSysUser: '/SysUser/Save',
    delSysUser: '/SysUser/Delete',
    checkSysUserExists: '/SysUser/CheckUserExists',
    getDoctors: '/SysUser/QueryDoctors',
    changeLoginPwd: '/Home/ChangeLoginPwd'
}
// 获取用户列表数据
export function getSysUserData (key, pagination) {
    return request({
        url: userApi.getSysUserData + `?key=${key}&page=${pagination.current}&limit=${pagination.pageSize}`,
        method: 'get'
    })
}
// 检测用户是否存在
export function checkSysUserExists (code, name) {
    return request({
        url: userApi.checkSysUserExists + `?nodeCode=${encodeURIComponent(code, 'utf-8')}&nodeName=${name}`,
        method: 'get'
    })
}
// 保存用户
export function saveSysUser (parameter) {
    return request({
        url: userApi.saveSysUser,
        method: 'post',
        data: parameter
    })
}
// 修改个人密码
export function changeLoginPwd (parameter) {
    return request({
        url: userApi.changeLoginPwd,
        method: 'post',
        data: parameter
    })
}
// 删除用户
export function delSysUser (id) {
    return request({
        url: userApi.delSysUser + '?id=' + id,
        method: 'delete'
    })
}
// 获取医生信息
export function getDoctors () {
    return request({
        url: userApi.getDoctors,
        method: 'get'
    })
}
