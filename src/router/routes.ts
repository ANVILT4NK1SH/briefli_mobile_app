import { createAuthGuard } from '@auth0/auth0-vue';
import type { RouteRecordRaw } from 'vue-router';

const authGuard = createAuthGuard();
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home', //load home component on initiation
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: authGuard,
    children: [
      {
        path: '/home',
        component: () => import('components/HomePage.vue'),
        beforeEnter: authGuard,
      },
      {
        path: '/clients',
        component: () => import('components/ClientList.vue'),
        beforeEnter: authGuard,
      },
      {
        path: '/review',
        component: () => import('components/ReviewFiles.vue'),
        beforeEnter: authGuard,
      },
      {
        path: '/briefliAI',
        component: () => import('components/BriefliAI.vue'),
        beforeEnter: authGuard,
      },
      {
        path: '/userPage',
        component: () => import('components/UserPage.vue'),
        beforeEnter: authGuard,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
