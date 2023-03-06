// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts';

// const RouteView = {
//   name: 'RouteView',
//   render: (h) => h('router-view')
// }
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard/workplace',
        name: 'workplace',
        component: () => import('@/views/system/dashboard/Workplace'),
        meta: {
          title: 'menu.dashboard.workplace',
          topName: '工作台',
          keepAlive: true,
          icon: 'windows',
          permission: ['dashboard'],
        },
      },
      // system
      {
        path: '/system',
        name: 'system',
        redirect: '/system',
        component: RouteView,
        meta: { title: 'menu.system', keepAlive: true, icon: 'setting', permission: ['S01'] },
        children: [
          {
            path: '/system/menu',
            name: 'menu',
            component: () => import('@/views/system/menu/MenuList'),
            meta: {
              title: 'menu.system.menu.menu-list',
              topName: '菜单管理',
              keepAlive: true,
              permission: ['S01001'],
            },
          },
          {
            path: '/system/user',
            name: 'user',
            component: () => import('@/views/system/user/UserList'),
            meta: {
              title: 'menu.system.user.user-List',
              topName: '用户管理',
              keepAlive: true,
              permission: ['S01002'],
            },
          },
          {
            path: '/system/role',
            name: 'role',
            component: () => import('@/views/system/role/RoleList'),
            meta: {
              title: 'menu.system.role.role-list',
              topName: '角色管理',
              keepAlive: true,
              permission: ['S01003'],
            },
          },
          {
            path: '/system/dictionary',
            name: 'dictionary',
            component: () => import('@/views/system/dictionary/DictionaryList'),
            meta: {
              title: 'menu.system.dictionary.dictionary-list',
              topName: '数据字典',
              keepAlive: true,
              permission: ['S01004'],
            },
          },
          {
            path: '/system/workflow',
            name: 'workflow',
            component: () => import('@/views/system/workflow/WorkflowList'),
            meta: {
              title: 'menu.system.workflow.workflow-list',
              topName: '流程管理',
              keepAlive: true,
              permission: ['S01005'],
            },
          },
          {
            path: '/system/strategy',
            name: 'strategy',
            component: () => import('@/views/system/strategy/MainList'),
            meta: {
              title: 'menu.system.strategy.strategy-list',
              topName: '策略管理',
              keepAlive: true,
              permission: ['S01007'],
            },
          },
          {
            path: '/system/usersetting',
            name: 'usersetting',
            component: () => import('@/views/system/user/UserSetting'),
            meta: {
              title: 'menu.system.user.usersetting',
              topName: '个人设置',
              keepAlive: true,
              permission: ['S01008'],
            },
          },
          {
            path: '/system/sysconfig',
            name: 'sysconfig',
            component: () => import('@/views/system/sysconfig/ConfigList'),
            meta: {
              title: 'menu.system.sysconfig.sysconfig-list',
              topName: '',
              keepAlive: true,
              permission: ['S01006'],
            },
          },
          {
            path: '/system/logs',
            name: 'log',
            component: () => import('@/views/system/logs/SysLogList'),
            meta: {
              title: 'menu.system.log.syslog-list',
              topName: '',
              keepAlive: true,
              permission: ['S01009'],
            },
          },
        ],
      },
      // basics
      {
        path: '/basics',
        name: 'basics',
        redirect: '/basics',
        component: RouteView,
        meta: { title: 'menu.basics', keepAlive: true, icon: 'database', permission: ['B01'] },
        children: [
          {
            path: '/basics/department',
            name: 'department',
            component: () => import('@/views/basics/department/DepartmentList'),
            meta: {
              title: 'menu.system.department.department-list',
              topName: '科室管理',
              keepAlive: true,
              permission: ['B01001'],
            },
          },
          {
            path: '/system/checkitem',
            name: 'checkitem',
            component: () => import('@/views/basics/checkitem/CheckitemList'),
            meta: {
              title: 'menu.system.checkitem.checkitem-List',
              topName: '检查项目',
              keepAlive: true,
              permission: ['B01002'],
            },
          },
          {
            path: '/system/checkpart',
            name: 'checkpart',
            component: () => import('@/views/basics/checkpart/CheckpartList'),
            meta: {
              title: 'menu.system.checkpart.checkpart-list',
              topName: '检查部位',
              keepAlive: true,
              permission: ['B01003'],
            },
          },
        ],
      },
      // submission
      {
        path: '/submission',
        name: 'submission',
        redirect: '/submission',
        component: RouteView,
        meta: { title: 'menu.submission', keepAlive: true, icon: 'cloud', permission: ['A02'] },
        children: [
          {
            path: '/submission/app',
            name: 'app',
            component: () => import('@/views/submission/app/AppList'),
            meta: {
              title: 'menu.submission.app.app-list',
              topName: '病理申请',
              keepAlive: true,
              permission: ['A02001'],
            },
          },
          {
            path: '/submission/healthApply',
            name: 'healthApply',
            component: () => import('@/views/submission/app/HealthApply'),
            meta: {
              title: 'menu.submission.app.health-apply',
              topName: '体检申请',
              keepAlive: true,
              permission: ['A0200101'],
            },
          },
          {
            path: '/submission/print',
            name: 'print',
            component: () => import('@/views/submission/print/PrintList'),
            meta: {
              title: 'menu.submission.print.print-List',
              topName: '预检打印',
              keepAlive: true,
              permission: ['A02002'],
            },
          },
          {
            path: '/submission/collect',
            name: 'collect',
            component: () => import('@/views/submission/collect/CollectList'),
            meta: {
              title: 'menu.submission.collect.collect-list',
              topName: '标本采集',
              keepAlive: true,
              permission: ['A02003'],
            },
          },
          {
            path: '/submission/submit',
            name: 'submit',
            component: () => import('@/views/submission/submit/SubmitList'),
            meta: {
              title: 'menu.submission.submit.submit-list',
              topName: '提交申请',
              keepAlive: true,
              permission: ['A02004'],
            },
          },
          {
            path: '/submission/register',
            name: 'register',
            component: () => import('@/views/submission/register/RegisterList'),
            meta: {
              title: 'menu.submission.register.register-list',
              topName: '标本登记',
              keepAlive: true,
              permission: ['A02005'],
            },
          },
          {
            path: '/submission/packaging',
            name: 'packaging',
            component: () => import('@/views/submission/packaging/PackagingList'),
            meta: {
              title: 'menu.submission.packaging.packaging-list',
              topName: '标本打包',
              keepAlive: true,
              permission: ['A02006'],
            },
          },
          {
            path: '/submission/send',
            name: 'send',
            component: () => import('@/views/submission/send/SendList'),
            meta: {
              title: 'menu.submission.send.send-list',
              topName: '物流运送',
              keepAlive: true,
              permission: ['B02007'],
            },
          },
          {
            path: '/submission/receive',
            name: 'receive',
            component: () => import('@/views/submission/receive/ReceiveList'),
            meta: {
              title: 'menu.submission.receive.receive-list',
              topName: '运送接收',
              keepAlive: true,
              permission: ['B02008'],
            },
          },
          {
            path: '/submission/speciment',
            name: 'speciment',
            component: () => import('@/views/submission/speciment/SpecimentTrace'),
            meta: {
              title: 'menu.submission.speciment.specimenttrace',
              topName: '标本查询',
              keepAlive: true,
              permission: ['A02010'],
            },
          },
          {
            path: '/submission/message',
            name: 'message',
            component: () => import('@/views/submission/message/MessageList'),
            meta: {
              title: 'menu.submission.message.message-list',
              topName: '信息中心',
              keepAlive: true,
              permission: ['C02001'],
            },
          },
          {
            path: '/submission/specimenfollow',
            name: 'specimenfollow',
            component: () => import('@/views/system/dashboard/SpecimenFollow'),
            meta: {
              title: 'menu.submission.specimenfollow.specimenfollow-list',
              topName: '任务追踪',
              keepAlive: true,
              permission: ['C02002'],
            },
          },
          {
            path: '/submission/appointment',
            name: 'appointment',
            component: () => import('@/views/submission/appointment/List'),
            meta: {
              title: 'menu.submission.appointment.appointment-list',
              topName: '送检预约',
              keepAlive: true,
              permission: ['C02003'],
            },
          },
          {
            path: '/submission/speciment/doctortakeaway',
            name: 'doctortakeaway',
            component: () => import('@/views/submission/speciment/DoctorTakeAwayList'),
            meta: {
              title: 'menu.submission.speciment.doctortakeaway-list',
              topName: '',
              keepAlive: true,
              permission: ['A02011'],
            },
          },
        ],
      },
      // statistic
      {
        path: '/statistic',
        name: 'statistic',
        component: RouteView,
        redirect: '/statistic/AppOrderInfo',
        meta: {
          title: 'menu.statistic',
          keepAlive: true,
          icon: 'check-circle-o',
          permission: ['S02'],
        },
        children: [
          {
            path: '/statistic/AppOrderInfo',
            name: 'AppOrderInfo',
            component: () => import(/* webpackChunkName: "result" */ '@/views/statistic/AppOrderInfo'),
            meta: {
              title: 'menu.statistic.appOrderInfo',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['S02001'],
            },
          },
          {
            path: '/statistic/PackageAppOrderInfo',
            name: 'PackageAppOrderInfo',
            component: () => import(/* webpackChunkName: "result" */ '@/views/statistic/PackageAppOrderInfo'),
            meta: {
              title: 'menu.statistic.packageAppOrderInfo',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['S02002'],
            },
          },
          {
            path: '/statistic/fixedTimeError',
            name: 'fixedTimeError',
            component: () => import('@/views/statistic/FixedTimeError'),
            meta: {
              title: 'menu.statistic.fixedTimeError',
              topName: '标本固定异常',
              keepAlive: true,
              permission: ['A02012'],
            },
          },
          {
            path: '/statistic/receiveTimeError',
            name: 'receiveTimeError',
            component: () => import('@/views/statistic/ReceiveTimeError'),
            meta: {
              title: 'menu.statistic.receiveTimeError',
              topName: '标本接收异常',
              keepAlive: true,
              permission: ['S02003'],
            },
          },
          {
            path: '/statistic/sendTimeError',
            name: 'sendTimeError',
            component: () => import('@/views/statistic/SendTimeError'),
            meta: {
              title: 'menu.statistic.sendTimeError',
              topName: '标本运送异常',
              keepAlive: true,
              permission: ['S02004'],
            },
          },
        ],
      },
      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: {
          title: 'menu.result',
          keepAlive: true,
          icon: 'check-circle-o',
          permission: ['result'],
        },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: {
              title: 'menu.result.success',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result'],
            },
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import('@/views/result/Error'),
            meta: {
              title: 'menu.result.fail',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result'],
            },
          },
        ],
      },
      //测试练习examine
      {
        path: '/examine',
        name: 'examine',
        component: RouteView,
        meta: { title: '测试页面', keepAlive: true, icon: 'check-circle-o', permission: ['S02'] },
        children: [
          {
            path: '/examine/application',
            name: 'application',
            component: () => import('@/views/examine/application/AppListNew'),
            meta: {
              title: '病理申请',
              topName: '病理申请',
              keepAlive: true,
              // permission: ['A02001'],
            },
          },
          {
            path: '/examine/sampling',
            name: 'SamplingList',
            component: () => import('@/views/examine/sampling/SamplingList'),
            meta: {
              title: '取材',
              topName: '病理取材',
              keepAlive: true,
              // permission: ['A02001'],
            },
          },
          {
            path: '/examine/dynamicTestList',
            name: 'dynamicTestList',
            component: () => import('@/views/examine/dynamicTest/dynamicTestList'),
            meta: {
              title: '组件测试',
              topName: '病理申请',
              keepAlive: true,
              permission: ['A02001'],
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

export const OriginalRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.dashboard.workplace' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard/workplace',
        name: 'workplace',
        component: () => import('@/views/system/dashboard/Workplace'),
        meta: {
          title: 'menu.dashboard.workplace',
          topName: '工作台',
          keepAlive: true,
          permission: ['dashboard'],
        },
      },
      // system
      {
        path: '/system',
        name: 'system',
        redirect: '/system',
        component: RouteView,
        meta: { title: 'menu.system', keepAlive: true, icon: 'setting', permission: ['S01'] },
        children: [
          {
            path: '/system/menu',
            name: 'menu',
            component: () => import('@/views/system/menu/MenuList'),
            meta: {
              title: 'menu.system.menu.menu-list',
              topName: '菜单管理',
              keepAlive: true,
              permission: ['S01001'],
            },
          },
          {
            path: '/system/user',
            name: 'user',
            component: () => import('@/views/system/user/UserList'),
            meta: {
              title: 'menu.system.user.user-List',
              topName: '用户管理',
              keepAlive: true,
              permission: ['S01002'],
            },
          },
          {
            path: '/system/role',
            name: 'role',
            component: () => import('@/views/system/role/RoleList'),
            meta: {
              title: 'menu.system.role.role-list',
              topName: '角色管理',
              keepAlive: true,
              permission: ['S01003'],
            },
          },
          {
            path: '/system/dictionary',
            name: 'dictionary',
            component: () => import('@/views/system/dictionary/DictionaryList'),
            meta: {
              title: 'menu.system.dictionary.dictionary-list',
              topName: '数据字典',
              keepAlive: true,
              permission: ['S01004'],
            },
          },
          {
            path: '/system/workflow',
            name: 'workflow',
            component: () => import('@/views/system/workflow/WorkflowList'),
            meta: {
              title: 'menu.system.workflow.workflow-list',
              topName: '流程管理',
              keepAlive: true,
              permission: ['S01005'],
            },
          },
          {
            path: '/system/strategy',
            name: 'strategy',
            component: () => import('@/views/system/strategy/MainList'),
            meta: {
              title: 'menu.system.strategy.strategy-list',
              topName: '策略管理',
              keepAlive: true,
              permission: ['S01007'],
            },
          },
          {
            path: '/system/usersetting',
            name: 'usersetting',
            component: () => import('@/views/system/user/UserSetting'),
            meta: {
              title: 'menu.system.user.usersetting',
              topName: '个人设置',
              keepAlive: true,
              permission: ['S01008'],
            },
          },
          {
            path: '/system/sysconfig',
            name: 'sysconfig',
            component: () => import('@/views/system/sysconfig/ConfigList'),
            meta: {
              title: 'menu.system.sysconfig.sysconfig-list',
              topName: '',
              keepAlive: true,
              permission: ['S01006'],
            },
          },
          {
            path: '/system/logs',
            name: 'log',
            component: () => import('@/views/system/logs/SysLogList'),
            meta: {
              title: 'menu.system.log.syslog-list',
              topName: '',
              keepAlive: true,
              permission: ['S01009'],
            },
          },
        ],
      },
      // basics
      {
        path: '/basics',
        name: 'basics',
        redirect: '/basics',
        component: RouteView,
        meta: { title: 'menu.basics', keepAlive: true, icon: 'database', permission: ['B01'] },
        children: [
          {
            path: '/basics/department',
            name: 'department',
            component: () => import('@/views/basics/department/DepartmentList'),
            meta: {
              title: 'menu.system.department.department-list',
              topName: '科室管理',
              keepAlive: true,
              permission: ['B01001'],
            },
          },
          {
            path: '/system/checkitem',
            name: 'checkitem',
            component: () => import('@/views/basics/checkitem/CheckitemList'),
            meta: {
              title: 'menu.system.checkitem.checkitem-List',
              topName: '检查项目',
              keepAlive: true,
              permission: ['B01002'],
            },
          },
          {
            path: '/system/checkpart',
            name: 'checkpart',
            component: () => import('@/views/basics/checkpart/CheckpartList'),
            meta: {
              title: 'menu.system.checkpart.checkpart-list',
              topName: '检查部位',
              keepAlive: true,
              permission: ['B01003'],
            },
          },
        ],
      },
      // submission
      {
        path: '/submission',
        name: 'submission',
        redirect: '/submission',
        component: RouteView,
        meta: { title: 'menu.submission', keepAlive: true, icon: 'cloud', permission: ['A02'] },
        children: [
          {
            path: '/submission/app',
            name: 'app',
            component: () => import('@/views/submission/app/AppList'),
            meta: {
              title: 'menu.submission.app.app-list',
              topName: '病理申请',
              keepAlive: true,
              permission: ['A02001'],
            },
          },
          {
            path: '/submission/healthApply',
            name: 'healthApply',
            component: () => import('@/views/submission/app/HealthApply'),
            meta: {
              title: 'menu.submission.app.health-apply',
              topName: '体检申请',
              keepAlive: true,
              permission: ['A0200101'],
            },
          },
          {
            path: '/submission/print',
            name: 'print',
            component: () => import('@/views/submission/print/PrintList'),
            meta: {
              title: 'menu.submission.print.print-List',
              topName: '预检打印',
              keepAlive: true,
              permission: ['A02002'],
            },
          },
          {
            path: '/submission/collect',
            name: 'collect',
            component: () => import('@/views/submission/collect/CollectList'),
            meta: {
              title: 'menu.submission.collect.collect-list',
              topName: '标本采集',
              keepAlive: true,
              permission: ['A02003'],
            },
          },
          {
            path: '/submission/submit',
            name: 'submit',
            component: () => import('@/views/submission/submit/SubmitList'),
            meta: {
              title: 'menu.submission.submit.submit-list',
              topName: '提交申请',
              keepAlive: true,
              permission: ['A02004'],
            },
          },
          {
            path: '/submission/register',
            name: 'register',
            component: () => import('@/views/submission/register/RegisterList'),
            meta: {
              title: 'menu.submission.register.register-list',
              topName: '标本登记',
              keepAlive: true,
              permission: ['A02005'],
            },
          },
          {
            path: '/submission/packaging',
            name: 'packaging',
            component: () => import('@/views/submission/packaging/PackagingList'),
            meta: {
              title: 'menu.submission.packaging.packaging-list',
              topName: '标本打包',
              keepAlive: true,
              permission: ['A02006'],
            },
          },
          {
            path: '/submission/send',
            name: 'send',
            component: () => import('@/views/submission/send/SendList'),
            meta: {
              title: 'menu.submission.send.send-list',
              topName: '物流运送',
              keepAlive: true,
              permission: ['B02007'],
            },
          },
          {
            path: '/submission/receive',
            name: 'receive',
            component: () => import('@/views/submission/receive/ReceiveList'),
            meta: {
              title: 'menu.submission.receive.receive-list',
              topName: '运送接收',
              keepAlive: true,
              permission: ['B02008'],
            },
          },
          {
            path: '/submission/speciment',
            name: 'speciment',
            component: () => import('@/views/submission/speciment/SpecimentTrace'),
            meta: {
              title: 'menu.submission.speciment.specimenttrace',
              topName: '标本查询',
              keepAlive: true,
              permission: ['A02010'],
            },
          },
          {
            path: '/submission/message',
            name: 'message',
            component: () => import('@/views/submission/message/MessageList'),
            meta: {
              title: 'menu.submission.message.message-list',
              topName: '信息中心',
              keepAlive: true,
              permission: ['C02001'],
            },
          },
          {
            path: '/submission/specimenfollow',
            name: 'specimenfollow',
            component: () => import('@/views/system/dashboard/SpecimenFollow'),
            meta: {
              title: 'menu.submission.specimenfollow.specimenfollow-list',
              topName: '任务追踪',
              keepAlive: true,
              permission: ['C02002'],
            },
          },
          {
            path: '/submission/appointment',
            name: 'appointment',
            component: () => import('@/views/submission/appointment/List'),
            meta: {
              title: 'menu.submission.appointment.appointment-list',
              topName: '送检预约',
              keepAlive: true,
              permission: ['C02003'],
            },
          },
        ],
      },
      // statistic
      {
        path: '/statistic',
        name: 'statistic',
        component: RouteView,
        redirect: '/statistic/AppOrderInfo',
        meta: {
          title: 'menu.statistic',
          keepAlive: true,
          icon: 'check-circle-o',
          permission: ['S02'],
        },
        children: [
          {
            path: '/statistic/AppOrderInfo',
            name: 'AppOrderInfo',
            component: () => import(/* webpackChunkName: "result" */ '@/views/statistic/AppOrderInfo'),
            meta: {
              title: 'menu.statistic.appOrderInfo',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['S02001'],
            },
          },
          {
            path: '/statistic/PackageAppOrderInfo',
            name: 'PackageAppOrderInfo',
            component: () => import(/* webpackChunkName: "result" */ '@/views/statistic/PackageAppOrderInfo'),
            meta: {
              title: 'menu.statistic.packageAppOrderInfo',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['S02002'],
            },
          },
        ],
      },
      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: {
          title: 'menu.result',
          keepAlive: true,
          icon: 'check-circle-o',
          permission: ['result'],
        },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: {
              title: 'menu.result.success',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result'],
            },
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: {
              title: 'menu.result.fail',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['result'],
            },
          },
        ],
      },
      //测试
      {
        path: '/examine',
        name: 'examine',
        component: RouteView,
        redirect: '/test',
        meta: { title: '测试页面', keepAlive: true, icon: 'check-circle-o', permission: ['S02'] },
        children: [
          {
            path: '/test/application',
            name: 'application',
            component: () => import('@/views/examine/application/AppList'),
            meta: {
              title: '病理申请测试',
              topName: '病理申请',
              keepAlive: true,
              permission: ['A02001'],
            },
          },
          {
            path: '/examine/sampling',
            name: 'SamplingList',
            component: () => import('@/views/examine/sampling/SamplingList'),
            meta: {
              title: '取材',
              topName: '病理取材',
              keepAlive: true,
              // permission: ['A02001'],
            },
          },
          {
            path: '/test/dynamicTestList',
            name: 'dynamicTestList',
            component: () => import('@/views/examine/dynamicTest/dynamicTestList'),
            meta: {
              title: '组件测试',
              topName: '病理申请',
              keepAlive: true,
              permission: ['A02001'],
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/system/user/Login'),
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined,
      },
    ],
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
];
