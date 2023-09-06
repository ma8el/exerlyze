import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import Login from '../views/Login.vue'
import CompleteProfile from '@/views/CompleteProfile.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'workouts',
        component: () => import('@/views/Workouts.vue')
      },
      {
        path: 'nutrition',
        component: () => import('@/views/Nutrition.vue')
      },
      {
        path: 'you',
        component: () => import('@/views/You.vue')
      },
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/complete-profile',
    component: CompleteProfile
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
