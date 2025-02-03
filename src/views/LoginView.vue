<template>
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <div class="flex-grow flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
          <Login />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import Login from '../components/Auth/Login.vue';
  
  export default {
    name: 'LoginView',
    components: {
      Navbar,
      Login,
    },
  }
  </script>
  
  <style scoped>

  </style>
  