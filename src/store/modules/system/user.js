import storage from 'store';
import {
  login,
  getInfo,
  logout,
  getUserInfoByOutSide,
  getUserInfoForFastSend,
  getUserInfoForFastHealthApply,
  getUserInfoByCAKey,
} from '@/api/system/login';
import { ACCESS_TOKEN } from '@/store/mutation-types';
// 状态
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
  },
  // 改变
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name;
      state.welcome = welcome;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
  },
  // 动作
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            if (response && response.HttpStatusCode !== 200) {
              return resolve(response);
            }
            const result = response.Data;
            const menus = [];
            // role
            const roleObj = {
              id: result.LoginName,
              name: result.UserType,
              describe: result.Remack,
              status: result.status,
              creatorId: 'system',
              createTime: '',
              deleted: 0,
              permissions: menus,
            };
            roleObj.permissions.push({
              roleId: 'admin',
              permissionId: 'support',
              permissionName: '超级模块',
              actions:
                '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
              actionEntitySet: [
                {
                  action: 'add',
                  describe: '新增',
                  defaultCheck: false,
                },
                {
                  action: 'import',
                  describe: '导入',
                  defaultCheck: false,
                },
                {
                  action: 'get',
                  describe: '详情',
                  defaultCheck: false,
                },
                {
                  action: 'update',
                  describe: '修改',
                  defaultCheck: false,
                },
                {
                  action: 'delete',
                  describe: '删除',
                  defaultCheck: false,
                },
                {
                  action: 'export',
                  describe: '导出',
                  defaultCheck: false,
                },
              ],
              actionList: null,
              dataAccess: null,
            });
            result.role = roleObj;
            commit('SET_NAME', { name: result.NickName, welcome: '' });
            commit('SET_AVATAR', result.avatar);
            commit('SET_TOKEN', result.Token);
            commit('SET_INFO', result);
            sessionStorage.clear();
            sessionStorage['token'] = result.Token;
            storage.set(ACCESS_TOKEN, result.Token, 7 * 24 * 60 * 60 * 1000);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    GetInfoByOutSide({ commit, rootState }, info) {
      return new Promise((resolve, reject) => {
        getUserInfoByOutSide(info).then((response) => {
          const result = response.Data;
          // 动态添加用户角色权限菜单列表
          if (result) {
            const menus = [
              {
                roleId: result.LoginName,
                permissionId: 'dashboard',
                permissionName: 'dashboard',
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              },
            ];
            result.Menus.forEach((element) => {
              menus.push({
                roleId: result.LoginName,
                permissionId: element.NodeCode,
                permissionName: element.NodeName,
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              });
              element.ChildrenNodes.forEach((celement) => {
                menus.push({
                  roleId: result.LoginName,
                  permissionId: celement.NodeCode,
                  permissionName: celement.NodeName,
                  actions:
                    '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                  actionEntitySet: [
                    {
                      action: 'add',
                      describe: '新增',
                      defaultCheck: false,
                    },
                    {
                      action: 'query',
                      describe: '查询',
                      defaultCheck: false,
                    },
                    {
                      action: 'get',
                      describe: '详情',
                      defaultCheck: false,
                    },
                    {
                      action: 'update',
                      describe: '修改',
                      defaultCheck: false,
                    },
                    {
                      action: 'delete',
                      describe: '删除',
                      defaultCheck: false,
                    },
                  ],
                  actionList: null,
                  dataAccess: null,
                });
              });
            });
            // 框架用户角色模板
            const roleObj = {
              id: result.LoginName,
              name: result.UserType,
              describe: result.Remack,
              status: result.status,
              creatorId: 'system',
              createTime: 1497160610259,
              deleted: 0,
              permissions: menus,
            };
            roleObj.permissions.push({
              roleId: 'admin',
              permissionId: 'support',
              permissionName: '超级模块',
              actions:
                '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
              actionEntitySet: [
                {
                  action: 'add',
                  describe: '新增',
                  defaultCheck: false,
                },
                {
                  action: 'import',
                  describe: '导入',
                  defaultCheck: false,
                },
                {
                  action: 'get',
                  describe: '详情',
                  defaultCheck: false,
                },
                {
                  action: 'update',
                  describe: '修改',
                  defaultCheck: false,
                },
                {
                  action: 'delete',
                  describe: '删除',
                  defaultCheck: false,
                },
                {
                  action: 'export',
                  describe: '导出',
                  defaultCheck: false,
                },
              ],
              actionList: null,
              dataAccess: null,
            });
            result.role = roleObj;
            const role = result.role;
            role.permissions = result.role.permissions;
            role.permissions.map((per) => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map((action) => {
                  return action.action;
                });
                per.actionList = action;
              }
            });
            role.permissionList = role.permissions.map((permission) => {
              return permission.permissionId;
            });
            commit('SET_ROLES', result.role);
            commit('SET_TOKEN', result.Token);
            commit('SET_NAME', { name: result.UserType, welcome: '' });
            commit('SET_AVATAR', result.avatar);
            commit('SET_INFO', result);
            sessionStorage.clear();
            sessionStorage['token'] = result.Token;
            storage.set(ACCESS_TOKEN, result.Token, 24 * 60 * 60 * 1000);
            storage.set('flag', info.Flag, 24 * 60 * 60 * 1000);
            storage.set('dept', result.Department, 24 * 60 * 60 * 1000);
            storage.set('name', result.UserName, 24 * 60 * 60 * 1000);
            storage.set('type', info.Type, 24 * 60 * 60 * 1000);
            storage.set('number', info.Number, 24 * 60 * 60 * 1000);
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'));
          }
          resolve(result);
        });
      });
    },
    getUserInfoByCAKey({ commit, rootState }, CAKey) {
      return new Promise((resolve, reject) => {
        getUserInfoByCAKey(CAKey).then((response) => {
          const result = response.Data;
          // 动态添加用户角色权限菜单列表
          if (result) {
            const menus = [
              {
                roleId: result.LoginName,
                permissionId: 'dashboard',
                permissionName: 'dashboard',
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              },
            ];
            result.Menus.forEach((element) => {
              menus.push({
                roleId: result.LoginName,
                permissionId: element.NodeCode,
                permissionName: element.NodeName,
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              });
              element.ChildrenNodes.forEach((celement) => {
                menus.push({
                  roleId: result.LoginName,
                  permissionId: celement.NodeCode,
                  permissionName: celement.NodeName,
                  actions:
                    '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                  actionEntitySet: [
                    {
                      action: 'add',
                      describe: '新增',
                      defaultCheck: false,
                    },
                    {
                      action: 'query',
                      describe: '查询',
                      defaultCheck: false,
                    },
                    {
                      action: 'get',
                      describe: '详情',
                      defaultCheck: false,
                    },
                    {
                      action: 'update',
                      describe: '修改',
                      defaultCheck: false,
                    },
                    {
                      action: 'delete',
                      describe: '删除',
                      defaultCheck: false,
                    },
                  ],
                  actionList: null,
                  dataAccess: null,
                });
              });
            });
            // 框架用户角色模板
            const roleObj = {
              id: result.LoginName,
              name: result.UserType,
              describe: result.Remack,
              status: result.status,
              creatorId: 'system',
              createTime: 1497160610259,
              deleted: 0,
              permissions: menus,
            };
            roleObj.permissions.push({
              roleId: 'admin',
              permissionId: 'support',
              permissionName: '超级模块',
              actions:
                '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
              actionEntitySet: [
                {
                  action: 'add',
                  describe: '新增',
                  defaultCheck: false,
                },
                {
                  action: 'import',
                  describe: '导入',
                  defaultCheck: false,
                },
                {
                  action: 'get',
                  describe: '详情',
                  defaultCheck: false,
                },
                {
                  action: 'update',
                  describe: '修改',
                  defaultCheck: false,
                },
                {
                  action: 'delete',
                  describe: '删除',
                  defaultCheck: false,
                },
                {
                  action: 'export',
                  describe: '导出',
                  defaultCheck: false,
                },
              ],
              actionList: null,
              dataAccess: null,
            });
            result.role = roleObj;
            const role = result.role;
            role.permissions = result.role.permissions;
            role.permissions.map((per) => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map((action) => {
                  return action.action;
                });
                per.actionList = action;
              }
            });
            role.permissionList = role.permissions.map((permission) => {
              return permission.permissionId;
            });
            commit('SET_ROLES', result.role);
            commit('SET_TOKEN', result.Token);
            commit('SET_NAME', { name: result.UserType, welcome: '' });
            commit('SET_AVATAR', result.avatar);
            commit('SET_INFO', result);
            sessionStorage.clear();
            sessionStorage['token'] = result.Token;
            storage.set(ACCESS_TOKEN, result.Token, 24 * 60 * 60 * 1000);
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'));
          }
          resolve(response);
        });
      });
    },
    getUserInfoForFastSend({ commit, rootState }, flag) {
      return new Promise((resolve, reject) => {
        getUserInfoForFastSend().then((response) => {
          const result = response.Data;
          // 动态添加用户角色权限菜单列表
          if (result) {
            const menus = [
              {
                roleId: result.LoginName,
                permissionId: 'dashboard',
                permissionName: 'dashboard',
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              },
            ];
            result.Menus.forEach((element) => {
              menus.push({
                roleId: result.LoginName,
                permissionId: element.NodeCode,
                permissionName: element.NodeName,
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              });
              element.ChildrenNodes.forEach((celement) => {
                menus.push({
                  roleId: result.LoginName,
                  permissionId: celement.NodeCode,
                  permissionName: celement.NodeName,
                  actions:
                    '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                  actionEntitySet: [
                    {
                      action: 'add',
                      describe: '新增',
                      defaultCheck: false,
                    },
                    {
                      action: 'query',
                      describe: '查询',
                      defaultCheck: false,
                    },
                    {
                      action: 'get',
                      describe: '详情',
                      defaultCheck: false,
                    },
                    {
                      action: 'update',
                      describe: '修改',
                      defaultCheck: false,
                    },
                    {
                      action: 'delete',
                      describe: '删除',
                      defaultCheck: false,
                    },
                  ],
                  actionList: null,
                  dataAccess: null,
                });
              });
            });
            // 框架用户角色模板
            const roleObj = {
              id: result.LoginName,
              name: result.UserType,
              describe: result.Remack,
              status: result.status,
              creatorId: 'system',
              createTime: 1497160610259,
              deleted: 0,
              permissions: menus,
            };
            roleObj.permissions.push({
              roleId: 'admin',
              permissionId: 'support',
              permissionName: '超级模块',
              actions:
                '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
              actionEntitySet: [
                {
                  action: 'add',
                  describe: '新增',
                  defaultCheck: false,
                },
                {
                  action: 'import',
                  describe: '导入',
                  defaultCheck: false,
                },
                {
                  action: 'get',
                  describe: '详情',
                  defaultCheck: false,
                },
                {
                  action: 'update',
                  describe: '修改',
                  defaultCheck: false,
                },
                {
                  action: 'delete',
                  describe: '删除',
                  defaultCheck: false,
                },
                {
                  action: 'export',
                  describe: '导出',
                  defaultCheck: false,
                },
              ],
              actionList: null,
              dataAccess: null,
            });
            result.role = roleObj;
            const role = result.role;
            role.permissions = result.role.permissions;
            role.permissions.map((per) => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map((action) => {
                  return action.action;
                });
                per.actionList = action;
              }
            });
            role.permissionList = role.permissions.map((permission) => {
              return permission.permissionId;
            });
            commit('SET_ROLES', result.role);
            commit('SET_TOKEN', result.Token);
            commit('SET_NAME', { name: result.UserType, welcome: '' });
            commit('SET_AVATAR', result.avatar);
            commit('SET_INFO', result);
            sessionStorage.clear();
            sessionStorage['token'] = result.Token;
            storage.set(ACCESS_TOKEN, result.Token, 24 * 60 * 60 * 1000);
            storage.set('sendFlag', flag, 24 * 60 * 60 * 1000);
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'));
          }
          resolve(result);
        });
      });
    },
    getUserInfoForFastHealthApply({ commit, rootState }, flag) {
      return new Promise((resolve, reject) => {
        getUserInfoForFastHealthApply().then((response) => {
          const result = response.Data;
          // 动态添加用户角色权限菜单列表
          if (result) {
            const menus = [
              {
                roleId: result.LoginName,
                permissionId: 'dashboard',
                permissionName: 'dashboard',
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              },
            ];
            result.Menus.forEach((element) => {
              menus.push({
                roleId: result.LoginName,
                permissionId: element.NodeCode,
                permissionName: element.NodeName,
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'query',
                    describe: '查询',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              });
              element.ChildrenNodes.forEach((celement) => {
                menus.push({
                  roleId: result.LoginName,
                  permissionId: celement.NodeCode,
                  permissionName: celement.NodeName,
                  actions:
                    '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                  actionEntitySet: [
                    {
                      action: 'add',
                      describe: '新增',
                      defaultCheck: false,
                    },
                    {
                      action: 'query',
                      describe: '查询',
                      defaultCheck: false,
                    },
                    {
                      action: 'get',
                      describe: '详情',
                      defaultCheck: false,
                    },
                    {
                      action: 'update',
                      describe: '修改',
                      defaultCheck: false,
                    },
                    {
                      action: 'delete',
                      describe: '删除',
                      defaultCheck: false,
                    },
                  ],
                  actionList: null,
                  dataAccess: null,
                });
              });
            });
            // 框架用户角色模板
            const roleObj = {
              id: result.LoginName,
              name: result.UserType,
              describe: result.Remack,
              status: result.status,
              creatorId: 'system',
              createTime: 1497160610259,
              deleted: 0,
              permissions: menus,
            };
            roleObj.permissions.push({
              roleId: 'admin',
              permissionId: 'support',
              permissionName: '超级模块',
              actions:
                '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
              actionEntitySet: [
                {
                  action: 'add',
                  describe: '新增',
                  defaultCheck: false,
                },
                {
                  action: 'import',
                  describe: '导入',
                  defaultCheck: false,
                },
                {
                  action: 'get',
                  describe: '详情',
                  defaultCheck: false,
                },
                {
                  action: 'update',
                  describe: '修改',
                  defaultCheck: false,
                },
                {
                  action: 'delete',
                  describe: '删除',
                  defaultCheck: false,
                },
                {
                  action: 'export',
                  describe: '导出',
                  defaultCheck: false,
                },
              ],
              actionList: null,
              dataAccess: null,
            });
            result.role = roleObj;
            const role = result.role;
            role.permissions = result.role.permissions;
            role.permissions.map((per) => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map((action) => {
                  return action.action;
                });
                per.actionList = action;
              }
            });
            role.permissionList = role.permissions.map((permission) => {
              return permission.permissionId;
            });
            commit('SET_ROLES', result.role);
            commit('SET_TOKEN', result.Token);
            commit('SET_NAME', { name: result.UserType, welcome: '' });
            commit('SET_AVATAR', result.avatar);
            commit('SET_INFO', result);
            sessionStorage.clear();
            sessionStorage['token'] = result.Token;
            storage.set(ACCESS_TOKEN, result.Token, 24 * 60 * 60 * 1000);
            storage.set('healthApply', flag, 24 * 60 * 60 * 1000);
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'));
          }
          resolve(result);
        });
      });
    },
    // 获取用户信息,Make：目前存在刷新页面数据清空问题，目前是通过浏览器session进行保存
    GetInfo({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        getInfo(sessionStorage.getItem('token'))
          .then((response) => {
            const result = response.Data;
            // 动态添加用户角色权限菜单列表
            if (result) {
              const menus = [
                {
                  roleId: result.LoginName,
                  permissionId: 'dashboard',
                  permissionName: 'dashboard',
                  actions:
                    '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                  actionEntitySet: [
                    {
                      action: 'add',
                      describe: '新增',
                      defaultCheck: false,
                    },
                    {
                      action: 'query',
                      describe: '查询',
                      defaultCheck: false,
                    },
                    {
                      action: 'get',
                      describe: '详情',
                      defaultCheck: false,
                    },
                    {
                      action: 'update',
                      describe: '修改',
                      defaultCheck: false,
                    },
                    {
                      action: 'delete',
                      describe: '删除',
                      defaultCheck: false,
                    },
                  ],
                  actionList: null,
                  dataAccess: null,
                },
              ];
              result.Menus.forEach((element) => {
                menus.push({
                  roleId: result.LoginName,
                  permissionId: element.NodeCode,
                  permissionName: element.NodeName,
                  actions:
                    '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                  actionEntitySet: [
                    {
                      action: 'add',
                      describe: '新增',
                      defaultCheck: false,
                    },
                    {
                      action: 'query',
                      describe: '查询',
                      defaultCheck: false,
                    },
                    {
                      action: 'get',
                      describe: '详情',
                      defaultCheck: false,
                    },
                    {
                      action: 'update',
                      describe: '修改',
                      defaultCheck: false,
                    },
                    {
                      action: 'delete',
                      describe: '删除',
                      defaultCheck: false,
                    },
                  ],
                  actionList: null,
                  dataAccess: null,
                });
                element.ChildrenNodes.forEach((celement) => {
                  menus.push({
                    roleId: result.LoginName,
                    permissionId: celement.NodeCode,
                    permissionName: celement.NodeName,
                    actions:
                      '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                    actionEntitySet: [
                      {
                        action: 'add',
                        describe: '新增',
                        defaultCheck: false,
                      },
                      {
                        action: 'query',
                        describe: '查询',
                        defaultCheck: false,
                      },
                      {
                        action: 'get',
                        describe: '详情',
                        defaultCheck: false,
                      },
                      {
                        action: 'update',
                        describe: '修改',
                        defaultCheck: false,
                      },
                      {
                        action: 'delete',
                        describe: '删除',
                        defaultCheck: false,
                      },
                    ],
                    actionList: null,
                    dataAccess: null,
                  });
                });
              });
              // 框架用户角色模板
              const roleObj = {
                id: result.LoginName,
                name: result.UserType,
                describe: result.Remack,
                status: result.status,
                creatorId: 'system',
                createTime: 1497160610259,
                deleted: 0,
                permissions: menus,
              };
              roleObj.permissions.push({
                roleId: 'admin',
                permissionId: 'support',
                permissionName: '超级模块',
                actions:
                  '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
                actionEntitySet: [
                  {
                    action: 'add',
                    describe: '新增',
                    defaultCheck: false,
                  },
                  {
                    action: 'import',
                    describe: '导入',
                    defaultCheck: false,
                  },
                  {
                    action: 'get',
                    describe: '详情',
                    defaultCheck: false,
                  },
                  {
                    action: 'update',
                    describe: '修改',
                    defaultCheck: false,
                  },
                  {
                    action: 'delete',
                    describe: '删除',
                    defaultCheck: false,
                  },
                  {
                    action: 'export',
                    describe: '导出',
                    defaultCheck: false,
                  },
                ],
                actionList: null,
                dataAccess: null,
              });
              result.role = roleObj;
              const role = result.role;
              role.permissions = result.role.permissions;
              role.permissions.map((per) => {
                if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                  const action = per.actionEntitySet.map((action) => {
                    return action.action;
                  });
                  per.actionList = action;
                }
              });
              role.permissionList = role.permissions.map((permission) => {
                return permission.permissionId;
              });
              commit('SET_ROLES', result.role);
              commit('SET_TOKEN', result.Token);
              commit('SET_NAME', { name: result.UserType, welcome: '' });
              commit('SET_AVATAR', result.avatar);
              commit('SET_INFO', result);
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'));
            }
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    Logout({ commit, state }) {
      logout().then((res) => {});
      return new Promise((resolve) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            storage.remove(ACCESS_TOKEN);
            storage.remove('flag');
            storage.remove('dept');
            storage.remove('name');
            storage.remove('type');
            storage.remove('number');
            storage.remove('sendFlag');
            storage.remove('healthApply');
            resolve();
          })
          .catch(() => {
            resolve();
          })
          .finally(() => {});
      });
    },
  },
};

export default user;
