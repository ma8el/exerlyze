import { createRouter, createMemoryHistory } from 'vue-router';

const routes = [
    {
      path: '/',
      component: {
        template: '<div>Home</div>',
      },
    },
  ];

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default mockRouter;