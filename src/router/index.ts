import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import LoginForm from '../components/auth/LoginForm.vue';

const routes = [
  {
    path: '/login',
    component: LoginForm,
    meta: { public: true }
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'cases',
        component: () => import('../views/Cases.vue')
      },
      {
        path: 'clients',
        component: () => import('../views/Clients.vue')
      },
      {
        path: 'documents',
        component: () => import('../views/Documents.vue')
      },
      {
        path: 'reports',
        component: () => import('../views/Reports.vue')
      },
      {
        path: 'profile',
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'settings',
        component: () => import('../views/Settings.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  if (!to.meta.public && !auth.isAuthenticated) {
    next('/login');
    return;
  }
  
  if (to.path === '/login' && auth.isAuthenticated) {
    next('/');
    return;
  }
  
  next();
});

export default router;
