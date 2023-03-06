import request from '@/utils/request';
import { TimeToString } from '@/utils/util';

const orderApi = {
  getOrderData: '/Order/LoadApplyData',
  getAppointmentOrderData: '/Order/LoadAppointmentApplyData',
  saveOrder: '/Order/Save',
  delOrder: '/Order/Delete',
  getHISInfo: '/Order/GetHISInfo',
  getOrderTrackingNodes: '/Order/QueryTrackingNodes',
  getSpecimenStatus: '/Order/LoadSpecimenStatus',
  getSpecimenNames: '/Order/GetSpecimenNames',
  getOrderSpecimens: '/Order/LoadSpecimens',
  getAppOrderItem: '/Order/GetAppOrderItem',
  getAppOrderItemByAdmissionNum: '/Order/GetAppOrderItemByAdmissionNum',
  getAppOrderNewsForPrint: '/Order/GetAppOrderNewsForPrint',
  checkAppOrder: '/Order/CheckAppOrder',
  loadDataForAppOrderEdit: '/Order/LoadDataForAppOrderEdit',
  doctorTakeAway: '/Order/doctorTakeAway',
  getDoctorTakeAway: '/Order/GetDoctorTakeAway',
  getDoctorTakeAwayItem: '/Order/GetDoctorTakeAwayItem',
  getDoctorTakeAwaySpecimens: '/Order/GetDoctorTakeAwaySpecimens',
};
// 获取申请单编辑页面预加载数据项
export function loadDataForAppOrderEdit() {
  return request({
    url: orderApi.loadDataForAppOrderEdit,
    method: 'get',
  });
}
// 检测申请单
export function checkAppOrder(parameter) {
  return request({
    url: orderApi.checkAppOrder,
    method: 'post',
    data: parameter,
  });
}
// 获取申请单列表数据
export function getOrderData(pagination, filters) {
  return request({
    url:
      orderApi.getOrderData +
      `?departmen=${filters.department}&sendDepartment=${filters.sendDepartment}&keyword=${filters.type}&value=${filters.keys}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${pagination.current}&limit=${pagination.pageSize}&pathologyType=${filters.pathologyType}&feeIhcFlag=${filters.feeIhcFlag}`,
    method: 'get',
  });
}
// 获取预约申请单列表数据
export function getAppointmentOrderData(pagination, filters) {
  return request({
    url:
      orderApi.getAppointmentOrderData +
      `?keyword=${filters.type}&value=${filters.keys}&startDate=${TimeToString(filters.startDate)}&endDate=${TimeToString(filters.endDate)}&page=${
        pagination.current
      }&limit=${pagination.pageSize}&pathologyType=${filters.pathologyType}`,
    method: 'get',
  });
}
// 获取申请单列表数据(打印)
export function getAppOrderNewsForPrint(ids) {
  return request({
    url: orderApi.getAppOrderNewsForPrint + `?ids=${ids}`,
    method: 'get',
  });
}
// 获取单个申请单数据
export function getAppOrderItem(id) {
  return request({
    url: orderApi.getAppOrderItem + `?id=${id}`,
    method: 'get',
  });
}
// 获取单个申请单数据
export function getAppOrderItemByAdmissionNum(no) {
  return request({
    url: orderApi.getAppOrderItemByAdmissionNum + `?no=${no}`,
    method: 'get',
  });
}
// 获取申请单追踪记录
export function getOrderTrackingNodes(id) {
  return request({
    url: orderApi.getOrderTrackingNodes + `?id=${id}&sendId=`,
  });
}
// 保存申请单
export function saveOrder(parameter) {
  return request({
    url: orderApi.saveOrder,
    method: 'post',
    data: parameter,
  });
}
// 删除申请单
export function delOrder(id) {
  return request({
    url: orderApi.delOrder + '?id=' + id,
    method: 'delete',
  });
}
// 获取病人His信息
export function getHisInfo(type, value, flag) {
  return request({
    url: orderApi.getHISInfo + `?type=${type}&queryParam=${value}&flag=${flag}`,
    method: 'get',
  });
}
// 获取标本状态字典
export function getSpecimenStatus() {
  return request({
    url: orderApi.getSpecimenStatus,
    method: 'get',
  });
}
// 获取标本名称列表
export function getSpecimenNames(val) {
  return request({
    url: orderApi.getSpecimenNames + '?name=' + val,
    method: 'get',
  });
}

// 获取申请单对应标本信息
export function getOrderSpecimens(id) {
  return request({
    url: orderApi.getOrderSpecimens + `?id=${id}`,
    method: 'get',
  });
}

// 医生带走标本
export function doctorTakeAway(parameter) {
  return request({
    url: orderApi.doctorTakeAway,
    method: 'post',
    data: parameter,
  });
}

// 获取医生带走标本信息
export function getDoctorTakeAway(pagination, filters) {
  return request({
    url:
      orderApi.getDoctorTakeAway +
      `?code=${filters.code}&startDate=${filters.startDate}&endDate=${filters.endDate}&pageIndex=${pagination.current}&pageSize=${pagination.pageSize}`,
    method: 'get',
  });
}

// 获取医生带走标本项信息
export function getDoctorTakeAwayItem(id) {
  return request({
    url: orderApi.getDoctorTakeAwayItem + `?id=${id}`,
    method: 'get',
  });
}
// 获取申请单医生带走标本项信息
export function getDoctorTakeAwaySpecimens(id) {
  return request({
    url: orderApi.getDoctorTakeAwaySpecimens + `?id=${id}`,
    method: 'get',
  });
}
// 获取CA签名图片
export function getPicture(req) {
  return request({
    url: '/Order/GetPictureExtend',
    method: 'post',
    data: req,
  });
}
// 获取CA Token
export function getToken(req) {
  return request({
    url: '/Order/GetToken',
    method: 'post',
    data: req,
  });
}
