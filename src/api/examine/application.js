import request from '@/utils/request';

const orderApi = {
  saveMedicalRecord: '/Examine/SaveMedicalRecord',
  getMedicalRecordList: '/Examine/GetMedicalRecordList',
  getSpecimensByMrId: '/Examine/GetSpecimensByMrId',
  saveSpecimens: '/Examine/saveSpecimens',
  receiveMedicalRecord: '/Examine/ReceiveMedicalRecord',
};
//获取病理申请单列表(新)
export function getMedicalRecordList(queryForm) {
  return request({
    url: orderApi.getMedicalRecordList,
    method: 'post',
    data: queryForm,
  });
}
// 新建申请单
export function saveMedicalRecord(medicalRecord) {
  return request({
    url: orderApi.saveMedicalRecord,
    method: 'post',
    data: medicalRecord,
  });
}
// 通过病例id获取标本列表
export function getSpecimensByMrId(id) {
  return request({
    url: orderApi.getSpecimensByMrId + `?id=${id}`,
    method: 'get',
  });
}
// 通过病例id获取标本列表
export function saveSpecimens(specimens) {
  return request({
    url: orderApi.saveSpecimens,
    method: 'post',
    data: { ObjectDTO: specimens },
  });
}
//接收病理单
export function receiveMedicalRecord(ids) {
  return request({
    url: orderApi.receiveMedicalRecord + `?ids=${ids.join(',')}`,
    method: 'get',
  });
}
