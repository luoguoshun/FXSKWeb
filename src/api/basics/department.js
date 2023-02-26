import request from '@/utils/request'

const departmentApi = {
    getDepartmentPageData: '/Department/LoadData',
    saveDepartment: '/Department/Save',
    delDepartment: '/Department/Delete',
    getDepartmentData: '/Department/QueryDepartments'
}
// 获取科室分页列表数据
export function getDepartmentPageData (key = '', page = 1, limit = 99999) {
    return request({
        url: departmentApi.getDepartmentPageData + `?key=${key}&page=${page}&limit=${limit}`,
        method: 'get'
    })
}
// 获取科室数据
export function getDepartmentData () {
    return request({
        url: departmentApi.getDepartmentData,
        method: 'get'
    })
}
// 保存科室
export function saveDepartment (parameter) {
    return request({
        url: departmentApi.saveDepartment,
        method: 'post',
        data: parameter
    })
}
// 删除科室
export function delDepartment (ids) {
    return request({
        url: departmentApi.delDepartment + `?ids=${ids}`,
        method: 'delete'
    })
}
