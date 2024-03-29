import { createRouter as _createRouter, createWebHistory } from 'vue-router';

export default function createRouter() {
  return _createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      { path: '/', component: () => import('@/pages/HomePage.vue') },
    ],
  });
}
