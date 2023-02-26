import request from '@/utils/request'

const collectApi = {
    getSpecimenCollectData: '/Order/QuerySpecimenCollectData',
    scanConfirmSpecimens: '/Order/ScanConfirmSpecimens',
    updateLeaveTime: '/Order/UpdateLeaveTime',
    updateFixedTime: '/Order/UpdateFixedTime',
    getAppSpecimensByOneId: '/Order/GetAppSpecimensByOneId',
    printSpecimenLabel: '/Order/PrintSpecimenLabel',
    delSpecimens: '/Order/DelSpecimens',
    getPrintLabelTemplate: '/Order/GetPrintLabelTemplate',
    getAppSpecimensById: '/Order/GetAppSpecimensById',
    updateSpecimenFixLiquid: '/Order/UpdateSpecimenFixLiquid',
    batchUpdateSpecimenFixedTime: '/Order/BatchUpdateSpecimenFixedTime',
    batchUpdateSpecimenFixLiquid: '/Order/BatchUpdateSpecimenFixLiquid',
    correctSpecimenWorkflow: '/Order/CorrectSpecimenWorkflow'
}
// 批量更新固定时间
export function batchUpdateSpecimenFixedTime (parameter) {
    return request({
        url: collectApi.batchUpdateSpecimenFixedTime,
        method: 'post',
        data: parameter
    })
}
// 批量更新固定液
export function batchUpdateSpecimenFixLiquid (parameter) {
    return request({
        url: collectApi.batchUpdateSpecimenFixLiquid,
        method: 'post',
        data: parameter
    })
}
export function correctSpecimenWorkflow (parameter) {
    return request({
        url: collectApi.correctSpecimenWorkflow,
        method: 'post',
        data: parameter
    })
}
// 更新离体时间
export function updateLeaveTime (parameter) {
    return request({
        url: collectApi.updateLeaveTime,
        method: 'post',
        data: parameter
    })
}
// 更新固定时间
export function updateFixedTime (parameter) {
    return request({
        url: collectApi.updateFixedTime,
        method: 'post',
        data: parameter
    })
}
// 更新固定液
export function updateSpecimenFixLiquid (parameter) {
    return request({
        url: collectApi.updateSpecimenFixLiquid,
        method: 'post',
        data: parameter
    })
}
// 扫码采集标本
export function scanConfirmSpecimens (parameter) {
    return request({
        url: collectApi.scanConfirmSpecimens,
        method: 'post',
        data: parameter
    })
}
// 根据采集扫码任意一个标本，根据ID查询申请单所有标本信息
export function getAppSpecimensByOneId (id, type) {
    return request({
        url: collectApi.getAppSpecimensByOneId + `?id=${id}&type=${type}`,
        method: 'get'
    })
}
// 根据手腕码查询申请单所有标本信息
export function getAppSpecimensById (code) {
    return request({
        url: collectApi.getAppSpecimensById + `?code=${code}`,
        method: 'get'
    })
}
// 获取采集数据
export function getSpecimenCollectData (pageIndex, pageSize, status) {
    return request({
        url: collectApi.getSpecimenCollectData + `?page=${pageIndex}&limit=${pageSize}&status=${status}`,
        method: 'get'
    })
}
