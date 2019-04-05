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
    {
      path: '/admin',
      name: 'AdminLayout',
      component: () => import('./components/Admin/Layout.vue'),
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: () => import('./components/Admin/Dashboard.vue'),
        },
        {
          path: 'classification',
          name: 'AdminClassificationList',
          component: () => import('./components/Admin/ClassificationList.vue')
        },
        {
          path: 'classification/:classificationId/algorithm/:algorithmId?/edit',
          name: 'AlgorithmEdit',
          component: () => import('./components/Admin/AlgorithmEdit.vue')
        }
      ],
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: () => import('./components/Admin/Login.vue')
    }
  ]
})
