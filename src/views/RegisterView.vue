<template>
    <div class="register-view">
      <Navbar />
      <div class="auth-container">
        <Register />
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import Register from '../components/Auth/Register.vue';
  
  export default {
    name: 'RegisterView',
    components: {
      Navbar,
      Register,
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  </style>
  