import { defineStore } from 'pinia';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseApp } from '../firebase'; 

const auth = getAuth(firebaseApp);

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(email, password) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
    },
    async register(email, password) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      this.user = userCredential.user;
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
    setUser(user) {
      this.user = user;
    },
  },
});
