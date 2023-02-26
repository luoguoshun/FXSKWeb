import request from '@/utils/request'

const messageApi = {
  getReportMassage: '/Message/GetReportMassage',
  getReportInfo: '/Message/GetReportInfo',
  setPathologyReportReading: '/Message/SetPathologyReportReading',
  getNotReadingReportTotal: '/Message/GetNotReadingReportTotal'
}
// 获取报告数据
export function getReportMassage (parameter) {
    return request({
        url: messageApi.getReportMassage,
        method: 'post',
        data: parameter
    })
}
// 获取报告
export function getReportInfo (HisSheetId) {
    return request({
        url: messageApi.getReportInfo + `?HisSheetId=${HisSheetId}`,
        method: 'get'
    })
}
// 获取登录人员未读报告
export function getNotReadingReportTotal () {
    return request({
        url: messageApi.getNotReadingReportTotal,
        method: 'get'
    })
}
// 设置报告阅读状态
export function setPathologyReportReading (parameter) {
    return request({
        url: messageApi.setPathologyReportReading,
        method: 'post',
        data: parameter
    })
}
