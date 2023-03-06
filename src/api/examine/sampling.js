import request from '@/utils/request';

const orderApi = {
  getSamplingInfoList: '/Examine/GetSamplingInfoList',
  getMedicalRecordList: '/Examine/GetMedicalRecordList',
  getSpecimensByMrId: '/Examine/GetSpecimensByMrId',
  saveSpecimens: '/Examine/saveSpecimens',
  receiveMedicalRecord: '/Examine/ReceiveMedicalRecord',
};
//获取病理申请单列表(新)
export function getSamplingInfoList(mrCode, sampledFlag, startReceiveTime, endReceiveTime, pathologyCode) {
  return request({
    url:
      orderApi.getSamplingInfoList +
      `?mrCode=${'X23'}&sampledFlag=${'0'}&startReceiveTime=${startReceiveTime}&endReceiveTime=${endReceiveTime}&pathologyCode=${pathologyCode}`,
    method: 'get',
  });
}
