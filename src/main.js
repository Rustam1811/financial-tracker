import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from './firebase';
import { useAuthStore } from './stores/auth';
import './assets/index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);


const auth = getAuth(firebaseApp);
onAuthStateChanged(auth, (user) => {
  const authStore = useAuthStore();
  authStore.setUser(user);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker зарегистрирован:', registration);
    }).catch((error) => {
      console.log('Ошибка при регистрации Service Worker:', error);
    });
  });
}


app.mount('#app');
