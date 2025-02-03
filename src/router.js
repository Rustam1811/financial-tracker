import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';
import { useAuthStore } from './stores/auth';
import { defineComponent } from 'vue';

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;
