// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/ArticlesView.vue')
    },
    {
      path: '/stock',
      name: 'stock',
      component: () => import('../views/StockView.vue')
    },
    {
      path: '/packaging',
      name: 'packaging',
      component: () => import('../views/PackagingView.vue')
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/CustomersView.vue')
    }
  ]
})

export default router
