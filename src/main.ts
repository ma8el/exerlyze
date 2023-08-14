import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import VCalendar from 'v-calendar';
import 'v-calendar/style.css'

import { createPinia } from 'pinia'

import { createI18n } from 'vue-i18n'
import { messages } from '@/locale'

const pinia = createPinia();

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages,
})

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(VCalendar, {})
  .use(pinia)
  .use(i18n);
  
router.isReady().then(() => {
  app.mount('#app');
});

//import { useWorkoutPlanStore, useWorkoutStore, usePlannedWorkoutStore, useWorkoutScheduleStore } from './store/workoutStore';
//import { useWeightStore } from './store/bodyMetricsStore';
//import { workouts, plannedWorkouts, workoutPlans, weights, workoutSchedules } from './local-test-data'
//const workoutStore = useWorkoutStore();
//const workoutPlanStore = useWorkoutPlanStore();
//const plannedWorkoutStore = usePlannedWorkoutStore();
//const weightStore = useWeightStore();
//const workoutScheduleStore = useWorkoutScheduleStore();
//
//workoutStore.addWorkout(workouts[0]);
//workoutStore.addWorkout(workouts[1]);
//
//workoutPlanStore.addWorkoutPlan(workoutPlans[0]);
//workoutPlanStore.addWorkoutPlan(workoutPlans[1]);
//
//plannedWorkoutStore.addPlannedWorkout(plannedWorkouts[0]);
//plannedWorkoutStore.addPlannedWorkout(plannedWorkouts[1]);
//plannedWorkoutStore.addPlannedWorkout(plannedWorkouts[2]);
//
//weightStore.addWeight(weights[0]);
//weightStore.addWeight(weights[1]);
//weightStore.addWeight(weights[2]);
//
//workoutScheduleStore.addWorkoutSchedule(workoutSchedules[0]);