import request from '@/utils/request'

const userApi = {
  Login: '/Home/DoLogin',
  Logout: '/Home/Logout',
  // get my info
  UserInfo: '/Home/GetUserInfo',
  getUserInfoByCAKey: '/Home/GetUserInfoByCAKey',
  getUserInfoByOutSide: '/Home/GetUserInfoByOutSide',
  getUserInfoForFastSend: '/Home/getUserInfoForFastSend',
  getUserInfoForFastHealthApply: '/Home/getUserInfoForFastHealthApply',
  TaskRun: '/Home/TaskRun'
}

/**
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}
/**
 * @param parameter
 * @returns {*}
 */
export function taskRun () {
  return request({
    url: userApi.TaskRun,
    method: 'post'
  })
}
export function getUserInfoForFastSend (parameter) {
  return request({
      url: userApi.getUserInfoForFastSend,
      method: 'post',
      data: parameter
  })
}
export function getUserInfoForFastHealthApply (parameter) {
  return request({
      url: userApi.getUserInfoForFastHealthApply,
      method: 'post',
      data: parameter
  })
}
// 获取用户列表数据(外部访问)
export function getUserInfoByOutSide (parameter) {
    return request({
        url: userApi.getUserInfoByOutSide,
        method: 'post',
        data: parameter
    })
}

export function getInfo (token) {
  return request({
    url: userApi.UserInfo + '?token=' + token,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getUserInfoByCAKey (CAKey) {
  return request({
    url: userApi.getUserInfoByCAKey + '?CAKey=' + CAKey,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
