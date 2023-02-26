import request from '@/utils/request'

const otherApi = {
  getUserByCode: '/Order/GetUserByCode',
  getSpecimens: '/Order/QuerySpecimens'
}
// 查询用户信息
export function getUserByCode (code, type) {
  return request({
      url: otherApi.getUserByCode + `?code=${code}&type=${type}`,
      method: 'get'
  })
}
// 查询标本信息
export function getSpecimens (parameter) {
  return request({
      url: otherApi.getSpecimens,
      method: 'post',
      data: parameter
  })
}
