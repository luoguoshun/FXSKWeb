import request from '@/utils/request'

const utilApi = {
  GetHISURL: '/Util/GetHISURL'
}
// 获取HisURL数据
export function GetHISURL () {
  return request({
      url: utilApi.GetHISURL,
      method: 'get'
  })
}
