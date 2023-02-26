import request from '@/utils/request'

const userApi = {
    getSysLogData: '/SysLog/LoadData'
}
// 获取日志列表数据
export function getSysLogData (key, pagination) {
    return request({
        url: userApi.getSysLogData + `?key=${key}&page=${pagination.current}&limit=${pagination.pageSize}`,
        method: 'get'
    })
}
