import request from '@/utils/request';
import { TimeToString } from '@/utils/util';

const orderApi = {
  getOrderData: '/Test/LoadApplyData',
  getAppointmentOrderData: '/Order/LoadAppointmentApplyData',
  saveOrder: '/Order/Save',
  deleteAppOrder: '/Test/DeleteAppOrder',
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

// 获取申请单列表数据
export function getOrderData(pagination, filters) {
  return request({
    url:
      orderApi.getOrderData +
      `?departmen=${filters.department}&sendDepartment=${filters.sendDepartment}&keyword=${filters.type}&value=${filters.keys}&startDate=${filters.startDate}&endDate=${filters.endDate}&page=${pagination.current}&limit=${pagination.pageSize}&pathologyType=${filters.pathologyType}&feeIhcFlag=${filters.feeIhcFlag}`,
    method: 'get',
  });
}

// 删除申请单
export function delOrder(id) {
  return request({
    url: orderApi.deleteAppOrder + '?id=' + id,
    method: 'delete',
  });
}
