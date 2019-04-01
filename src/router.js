import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('./components/User/Index.vue')
    },
    {
      path: '/classification/:classification_id',
      name: 'ClassificationDetail',
      component: () => import('./components/User/ClassificationDetail.vue')
    },
  ]
})
