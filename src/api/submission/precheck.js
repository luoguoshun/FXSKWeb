import request from '@/utils/request'

const precheckApi = {
    saveSpecimens: '/Order/SaveSpecimens',
    printSpecimenLabel: '/Order/PrintSpecimenLabel',
    delSpecimens: '/Order/DelSpecimens',
    getPrintLabelTemplate: '/Order/GetPrintLabelTemplate'
}
// 保存申请单标本(预检打印)
export function saveSpecimens (parameter) {
    return request({
        url: precheckApi.saveSpecimens,
        method: 'post',
        data: parameter
    })
}
// 打印申请单标本
export async function printSpecimenLabel (parameter) {
    return request({
        url: precheckApi.printSpecimenLabel,
        method: 'post',
        data: parameter
    })
}
// 删除申请单标本
export function delSpecimens (parameter) {
    return request({
        url: precheckApi.delSpecimens,
        method: 'post',
        data: parameter
    })
}
// 获取打印标签模板
export function getPrintLabelTemplate (type, target = 'Specimen') {
    return request({
        url: precheckApi.getPrintLabelTemplate + '?type=' + type + '&target=' + target,
        method: 'get'
    })
}
