import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { CheckField } from './utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const allowList = ['login'] // no redirect allowList
const allowCallList = ['DGFY', 'SZET', 'ZSRM']
const allowCallPage = [ { name:'ZSRM', path: '/submission/app' },{ name:'DGFY', path: '/submission/app' }, { name:'SZET', path: '/dashboard/workplace' } ]
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

// 全局前置路由导航守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  if (to.path === '/submission/health' && getUrlParam('isOpen') === 'true') {
    setTimeout(() => {
      store.dispatch('getUserInfoForFastHealthApply', 'isOpen').then(res => {
        const roles = res && res.role
        // generate dynamic router
        store.dispatch('GenerateRoutes', { roles }).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          router.addRoutes(store.getters.addRouters)
          // 请求带有 redirect 重定向时，登录自动重定向到该地址
          next({ path: '/submission/healthApply' })
        })
      })
    }, 2000)
  } else if (to.path === '/submission/fastSend' && getUrlParam('isOpen') === 'true') {
    setTimeout(() => {
      store.dispatch('getUserInfoForFastSend', 'isOpen').then(res => {
        const roles = res && res.role
        // generate dynamic router
        store.dispatch('GenerateRoutes', { roles }).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          router.addRoutes(store.getters.addRouters)
          // 请求带有 redirect 重定向时，登录自动重定向到该地址
          next({ path: '/submission/send' })
        })
      })
    }, 2000)
  } else if (to.path === '/submission/outSide' && allowCallList.includes(getUrlParam('flag'))) {
    const user = {
      'Flag': getUrlParam('flag'),
      'Name': getUrlParam('name'),
      'Code': getUrlParam('code'),
      'Department': getUrlParam('dept'),
      'Type': getUrlParam('type'),
      'Number': getUrlParam('number')
    }
    setTimeout(() => {
      store.dispatch('GetInfoByOutSide', user).then(res => {
        const roles = res && res.role
        // generate dynamic router
        store.dispatch('GenerateRoutes', { roles }).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          router.addRoutes(store.getters.addRouters)
          // 请求带有 redirect 重定向时，登录自动重定向到该地址
          next({ path: allowCallPage.filter(w => w.name === getUrlParam('flag'))[0].path })
        })
      })
    }, 2000)
  } else if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then(res => {
            const roles = res && res.role
            // generate dynamic router
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch((ers) => {
            // notification.error({
            //   message: '错误',
            //   description: ''
            // })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // debugger
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})
function getUrlParam (key) {
  var url = window.location.href
  var dzUrl = url.split('#')[0]
  var cs = dzUrl.split('?')[1]
  if (CheckField(cs) === false) {
    return ''
  }
  var csArr = cs.split('&')
  const data = {}
  for (var i = 0; i < csArr.length; i++) {
    const value = decodeURIComponent(csArr[i].split('=')[1])
    data[csArr[i].split('=')[0]] = value
  }
  return data[key]
}
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
