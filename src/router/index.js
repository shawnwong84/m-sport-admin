import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/pages/demo/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login/index.vue')
    },
    {
      path: '/',
      name: 'index',
      component: () => import('@/pages/index.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/pages/home/index.vue')
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('@/pages/userInfo/index.vue')
        },
        {
          path: '/moveDeatil',
          name: 'moveDeatil',
          component: () => import('@/pages/moveDeatil/index.vue')
        },
        {
          path: '/matchInfo',
          name: 'matchInfo',
          component: () => import('@/pages/matchInfo/index.vue')
        },
        {
          path: '/startType',
          name: 'startType',
          component: () => import('@/pages/startType/index.vue')
        },
        {
          path: '/payOrder',
          name: 'payOrder',
          component: () => import('@/pages/payOrder/index.vue')
        },
        {
          path: '/vip',
          name: 'vip',
          component: () => import('@/pages/vip/index.vue')
        },
        {
          path: '/down',
          name: 'down',
          component: () => import('@/pages/down/index.vue')
        },
        {
          path: '/config',
          name: 'config',
          component: () => import('@/pages/config/index.vue')
        },
        {
          path: '/statistics',
          name: 'statistics',
          component: () => import('@/pages/statistics/index.vue')
        },
        {
          path: '/operation',
          name: 'operation',
          component: () => import('@/pages/operation/index.vue')
        },
        {
          path: '/winning',
          name: 'winning',
          component: () => import('@/pages/winning/index.vue')
        },
        {
          path: '/icon',
          name: 'icon',
          component: () => import('@/pages/icon/index.vue')
        },
        {
          path: '/notice',
          name: 'notice',
          component: () => import('@/pages/notice/index.vue')
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('@/pages/role/index.vue')
        },
        {
          path: '/account',
          name: 'account',
          component: () => import('@/pages/account/index.vue')
        },
        {
          path: '/column',
          name: 'column',
          component: () => import('@/pages/column/index.vue')
        },
        {
          path: '/advertising',
          name: 'advertising',
          component: () => import('@/pages/advertising/index.vue')
        },
        {
          path: '/exchange',
          name: 'exchange',
          component: () => import('@/pages/exchange/index.vue')
        },
        {
          path: '/navigate',
          name: 'navigate',
          component: () => import('@/pages/navigate/index.vue')
        },
        {
          path: '/promote',
          name: 'promote',
          component: () => import('@/pages/promote/index.vue')
        },
        {
          path: '/withdrawal',
          name: 'withdrawal',
          component: () => import('@/pages/withdrawal/index.vue')
        },
        {
          path: '/robot',
          name: 'robot',
          component: () => import('@/pages/robot/index.vue')
        },
        {
          path: '/financial',
          name: 'financial',
          component: () => import('@/pages/financial/index.vue')
        },
        {
          path: '/liveInfo',
          name: 'liveInfo',
          component: () => import('@/pages/liveInfo/index.vue')
        },
        {
          path: '/byGold',
          name: 'byGold',
          component: () => import('@/pages/byGold/index.vue')
        },
        {
          path: '/label',
          name: 'label',
          component: () => import('@/pages/label/index.vue')
        }
      ]
    }
  ]
})
