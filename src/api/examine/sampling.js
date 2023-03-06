/*
 * @LastEditTime: 2023-03-03 17:12:38
 * @Descripttion: 
 */
import request from '@/utils/request';

const orderApi = {
  getSamplingInfoList: '/Examine/GetSamplingInfoList',
  createBoxs: '/Examine/CreateBoxs',
  getBoxListBySepecimenId: '/Examine/GetBoxListBySepecimenId',
  saveSamplingTask: '/Examine/SaveSamplingTask',
  deleteBoxs: '/Examine/DeleteBoxs',
};
/**
 * @description: 获取任务-病理申请单列表
 * @return {*} Promise
 * @param {*} mrCode 病理号
 * @param {*} sampledFlag 取材标记
 * @param {*} startReceiveTime 最早申请时间
 * @param {*} endReceiveTime 最晚申请时间
 * @param {*} pathologyCode 送检类型
 */
export function getSamplingInfoList(mrCode, sampledFlag, startReceiveTime, endReceiveTime, pathologyCode) {
  return request({
    url: orderApi.getSamplingInfoList,
    method: 'post',
    data: {
      MrCode: mrCode,
      SampledFlag: sampledFlag,
      StartReceiveTime: startReceiveTime,
      EndReceiveTime: endReceiveTime,
      PathologyCode: pathologyCode,
    },
  });
}

/**
 * @description: 生成包埋盒子
 * @return {*}
 * @param {*} boxs 包埋盒实体集合
 */
export function createBoxs(boxs) {
  return request({
    url: orderApi.createBoxs,
    method: 'post',
    data: {
      ObjectDTO: boxs,
    },
  });
}
/**
 * @description: 移除包埋盒
 * @return {*}
 * @param {*} specimenId 标本编号
 * @param {*} mrId 病例Id
 * @param {*} SonCodes 包埋盒子号集合
 */
export function deleteBoxs(specimenId, mrId, SonCodes) {
  return request({
    url: orderApi.deleteBoxs,
    method: 'post',
    data: {
      SpecimenId: specimenId,
      MrId: mrId,
      SonCodes: SonCodes,
    },
  });
}
/**
 * @description: 根据标本Id获取包埋盒
 * @return {*}
 * @param {*} specimenId 标本Id
 * @param {*} mrCode 病理号
 */
export function getBoxListBySepecimenId(specimenId, mrCode) {
  return request({
    url: orderApi.getBoxListBySepecimenId + `?specimenId=${specimenId}&mrCode=${mrCode}`,
    method: 'get',
  });
}

/**
 * @description: 保存取材任务
 * @return {*} Promise
 * @param {*} samplingTask 取材任务实体
 * @param {*} specimens 当前任务标本集合
 * @param {*} boxes 当前标本的包埋盒
 * @param {*} operateType 操作类别 Save为保存 Confirm 为确认取材
 */
export function saveSamplingTask(samplingTask, specimens, boxes, operateType) {
  return request({
    url: orderApi.saveSamplingTask,
    method: 'post',
    data: {
      SamplingTask: samplingTask,
      Specimens: specimens,
      Boxes: boxes,
      OperateType: operateType,
    },
  });
}
