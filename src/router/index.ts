import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import Login from '../views/Login.vue'
import CompleteProfile from '@/views/CompleteProfile.vue';
import ProfileSettings from '@/views/ProfileSettings.vue';
import ActivityHistory from '@/views/ActivityHistory.vue';
import Insights from '@/views/Insights.vue';
import WorkoutSettings from '@/views/WorkoutSettings.vue';

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
        path: 'profile',
        component: () => import('@/views/Profile.vue')
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
  },
  {
    path: '/profile-settings',
    component: ProfileSettings
  },
 
  {
    path: '/activity-history',
    component: ActivityHistory
  },
  {
    path: '/insights',
    component: Insights
  },
  {
    path: '/workout-settings',
    component: WorkoutSettings
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
