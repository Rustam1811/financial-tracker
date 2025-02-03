<template>
  <nav class="navbar">
    <router-link to="/" class="brand-name">Финансовый Трекер</router-link>
    <div class="auth-links">
      <div v-if="user" class="user-info">
        <!-- <span class="user-email">{{ user.email }}</span> -->
        <button @click="logout" class="logout-button">Выйти</button>
      </div>
      <div v-else class="guest-links">
        <router-link to="/login" class="link">Войти</router-link>
        <router-link to="/register" class="link">Регистрация</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();

    const logout = async () => {
      await authStore.logout();
    };

    return { user: authStore.user, logout };
  },
};
</script>

<style scoped>
.navbar {
  background-color: #86a6fd;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.5rem;
}

.brand-name {
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
  text-decoration: none;
}

.auth-links {
  display: flex;
  gap: 20px;
}

.user-info,
.guest-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-email {
  color: white;
}

.logout-button,
.link {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #f06472;
  color: white;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

.logout-button:hover,
.link:hover {
  background-color: #b94651;
}

.link {
  color: white;
  font-weight: bold;
}

.link:hover {
  color: #f0f0f0;
}
</style>
