import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store/'
import routes from './modules/'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

// 全局守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
