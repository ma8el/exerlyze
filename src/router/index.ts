import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import Login from '../views/Login.vue'
import CompleteProfile from '@/views/CompleteProfile.vue';
import SetFitnessLevel from '@/views/SetFitnessLevel.vue';
import SetDietGoals from '@/views/SetDietGoals.vue';
import ProfileSettings from '@/views/ProfileSettings.vue';
import ActivityHistory from '@/views/ActivityHistory.vue';
import Insights from '@/views/Insights.vue';
import FitnessLevelSettingsVue from '@/views/FitnessLevelSettings.vue';
import DietGoalSettingsVue from '@/views/DietGoalSettings.vue';

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
    component: CompleteProfile,
  },
  {
    path: '/complete-fitness-level',
    component: SetFitnessLevel,
  },
  {
    path: '/complete-diet-profile',
    component: SetDietGoals,
  },
  {
    path: '/profile-settings',
    component: ProfileSettings
  },
  {
    path: '/fitness-level-settings',
    component: FitnessLevelSettingsVue
  },
  {
    path: '/diet-goal-settings',
    component: DietGoalSettingsVue
  },
  {
    path: '/activity-history',
    component: ActivityHistory
  },
  {
    path: '/insights',
    component: Insights
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
