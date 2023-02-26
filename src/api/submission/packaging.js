import request from '@/utils/request';
import moment from 'moment';

const packagingApi = {
  getUnpackagedSpecimens: '/Order/QueryUnpackagedSpecimens',
  createPackage: '/Order/CreatePackage',
  getSendPackages: '/Order/GetSendPackages',
  getPackageSpecimens: '/Order/GetPackageSpecimens',
  GetAppSpecimensByNo: '/Order/GetAppSpecimensByNo',
  GetPackgedPrintInfo: '/Order/QueryPackgedPrintInfo',
  GetPackageSpecimensBySendId: '/Order/GetPackageSpecimensBySendId',
};
// 扫码登记
export function createPackage(parameter) {
  return request({
    url: packagingApi.createPackage,
    method: 'post',
    data: parameter,
  });
}
// 获取登记数据
export function getUnpackagedSpecimens(pagination) {
  return request({
    url: packagingApi.getUnpackagedSpecimens + `?page=${pagination.current}&limit=${pagination.pageSize}`,
    method: 'get',
  });
}
// 获取打包打印信息
export function GetPackgedPrintInfo(ids, type) {
  return request({
    url: packagingApi.GetPackgedPrintInfo + `?ids=${ids}&type=${type}`,
    method: 'get',
  });
}
// 获取已打包数据
export function getSendPackages(filter, pageIndex, pageSize) {
  let startDate = '';
  let endDate = '';
  if (filter.startDate !== '' && filter.startDate !== null) {
    startDate = moment(filter.startDate).format('YYYY-MM-DD 00:00:01');
  }
  if (filter.endDate !== '' && filter.endDate !== null) {
    endDate = moment(filter.endDate).format('YYYY-MM-DD 23:59:59');
  }
  return request({
    url:
      packagingApi.getSendPackages +
      `?sendNo=${filter.sendNo}&sendStatus=${filter.sendStatus}&startDate=${startDate}&endDate=${endDate}&page=${pageIndex}&limit=${pageSize}`,
    method: 'get',
  });
}
// 获取包裹Id对应标本信息
export function GetPackageSpecimensBySendId(id) {
  return request({
    url: packagingApi.GetPackageSpecimensBySendId + `?sendId=${id}`,
    method: 'get',
  });
}
// 获取包裹Id对应标本信息
export function getPackageSpecimens(id) {
  return request({
    url: packagingApi.getPackageSpecimens + `?sendId=${id}`,
    method: 'get',
  });
}
// 根据住院号获取申请单对应标本信息
export function GetAppSpecimensByNo(no) {
  return request({
    url: packagingApi.GetAppSpecimensByNo + `?no=${no}`,
    method: 'get',
  });
}
