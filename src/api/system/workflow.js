import request from '@/utils/request'

const workflowApi = {
    mainFlow: '/Workflow/GetMainFlow',
    childFlow: '/Workflow/GetMainSettingFlow',
    getSelectWorkflows: '/Workflow/GetSelectWorkflows',
    saveFlow: '/Workflow/Save',
    delFlow: '/Workflow/Delete',
    getFlowNode: '/WorkFlow/GetFlowNode',
    checkFlowExists: '/WorkFlow/CheckFlowExists',
    getWorkflowDepartment: '/WorkFlow/QueryWorkflowDepartment',
    getWorkflowDepartments: '/WorkFlow/QueryWorkflowDepartments',
    saveWorkflowDepartments: '/WorkFlow/SaveWorkflowDepartments',
    delWorkflowDepartments: '/WorkFlow/DelWorkflowDepartments',
    getSubmissionTypes: '/WorkFlow/GetSubmissionTypes'
}
// 获取主流程列表数据
export function getMainFlow () {
    return request({
        url: workflowApi.mainFlow,
        method: 'get'
    })
}
// 获取主流程下的配置流程节点
export function getChildFlow (id) {
    return request({
        url: workflowApi.childFlow + '?id=' + id,
        method: 'get'
    })
}
// 获取主流程&科室映射信息
export function getWorkflowDepartment (id) {
    return request({
        url: workflowApi.getWorkflowDepartment + '?id=' + id,
        method: 'get'
    })
}
// 获取主流程&科室映射信息
export function getWorkflowDepartments () {
    return request({
        url: workflowApi.getWorkflowDepartments,
        method: 'get'
    })
}
// 删除流程&科室映射项
export function delWorkflowDepartments (id) {
    return request({
        url: workflowApi.delWorkflowDepartments + '?id=' + id,
        method: 'delete'
    })
}
// 获取送检类型项
export function getSubmissionTypes () {
    return request({
        url: workflowApi.getSubmissionTypes,
        method: 'get'
    })
}
// 保存流程
export function saveWorkflowDepartments (parameter) {
    return request({
        url: workflowApi.saveWorkflowDepartments,
        method: 'post',
        data: parameter
    })
}
// 获取所有流程节点
export function getSelectWorkflows (id) {
    return request({
        url: workflowApi.getSelectWorkflows + '?id=' + id,
        method: 'get'
    })
}

// 保存流程
export function saveFlow (parameter) {
    return request({
        url: workflowApi.saveFlow,
        method: 'post',
        data: parameter
    })
}
// 删除流程
export function delFlow (id) {
    return request({
        url: workflowApi.delFlow + '?id=' + id,
        method: 'delete'
    })
}
// 获取流程节点
export function getFlowNode () {
    return request({
        url: workflowApi.getFlowNode,
        method: 'get'
    })
}
// 检测流程是否存在
export function checkFlowExists (code, name) {
    return request({
        url: workflowApi.checkFlowExists + `?flowNode=${encodeURIComponent(code, 'utf-8')}&flowName=${name}`,
        method: 'get'
    })
}
