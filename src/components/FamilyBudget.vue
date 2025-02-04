<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <h2>Семейный бюджет</h2>
        
        <div class="users-section">
          <h3>Участники</h3>
          <ul>
            <li v-for="user in familyBudget.participants" :key="user.id">
              <span class="user-info">{{ user.name }} (ID: {{ user.id }})</span>
              <button @click="removeUser(user.id)">Удалить</button>
            </li>
          </ul>
          <div v-if="familyBudget.participants.length < maxUsers" class="add-user">
            <h4>Добавить участника</h4>
            <form @submit.prevent="addUser">
              <input
                type="text"
                v-model="newUserId"
                placeholder="ID пользователя"
                required
              />
              <input
                type="text"
                v-model="newUserName"
                placeholder="Имя пользователя"
                required
              />
              <button type="submit">Добавить</button>
            </form>
          </div>
          <p v-else class="max-users-msg">
            Максимальное количество участников достигнуто.
          </p>
        </div>

        <div class="budget-info">
          <h3>Общий семейный бюджет</h3>
          <p>
            Общая сумма: <strong>{{ familyBudget.totalBudget }}</strong>
          </p>
        </div>
        
        <button class="close-btn" @click="close">Закрыть</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "FamilyBudget",
    data() {
      return {
        familyBudget: {
          participants: [],
          totalBudget: 0,
          transactions: []
        },
        newUserId: "",
        newUserName: "",
        maxUsers: 4,
        pollingInterval: null,
      };
    },
    methods: {
      async fetchFamilyBudget() {
        try {
          const response = await axios.get("/api/familyBudget");
          this.familyBudget = response.data;
        } catch (error) {
          console.error("Ошибка при получении семейного бюджета:", error);
        }
      },
      async updateFamilyBudget() {
        try {
          await axios.post("/api/familyBudget", this.familyBudget);
        } catch (error) {
          console.error("Ошибка при обновлении семейного бюджета:", error);
        }
      },
      async addUser() {
        if (this.familyBudget.participants.length < this.maxUsers) {
          const newUser = {
            id: this.newUserId,
            name: this.newUserName,
          };
          this.familyBudget.participants.push(newUser);
          await this.updateFamilyBudget();
          this.newUserId = "";
          this.newUserName = "";
        }
      },
      async removeUser(id) {
        this.familyBudget.participants = this.familyBudget.participants.filter(
          (user) => user.id !== id
        );
        await this.updateFamilyBudget();
      },
      close() {
        this.$emit("close");
      }
    },
    mounted() {
      this.fetchFamilyBudget();
      this.pollingInterval = setInterval(() => {
        this.fetchFamilyBudget();
      }, 5000);
    },
    beforeUnmount() {
      clearInterval(this.pollingInterval);
    },
  };
  </script>
  
  <style scoped>
 
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    position: relative;
  }
  
  .users-section h3 {
    margin-bottom: 15px;
    font-size: 20px;
    color: #333;
  }
  .users-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .users-section li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px;
    border-bottom: 1px solid #eee;
  }
  .user-info {
    font-size: 16px;
    color: #444;
  }
  .users-section button {
    background-color: #dc3545;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .users-section button:hover {
    background-color: #c82333;
  }
  .add-user {
    margin-top: 20px;
  }
  .add-user form {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .add-user input {
    flex: 1;
    min-width: 140px;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .add-user button {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #28a745;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .add-user button:hover {
    background-color: #218838;
  }
  .max-users-msg {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
  }
  
  .budget-info {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    margin-top: 20px;
    text-align: left;
  }
  .close-btn {
    margin-top: 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .close-btn:hover {
    background-color: #0056b3;
  }
  </style>
  