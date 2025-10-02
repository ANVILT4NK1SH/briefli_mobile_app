import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home', //load home component on initiation
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/home',
        component: () => import('components/HomePage.vue'),
      },
      {
        path: '/clients',
        component: () => import('components/ClientList.vue'),
      },
      {
        path: '/review',
        component: () => import('components/ReviewFiles.vue'),
      },
      {
        path: '/briefliAI',
        component: () => import('components/BriefliAI.vue'),
      },
      {
        path: '/userPage',
        component: () => import('components/UserPage.vue'),
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
