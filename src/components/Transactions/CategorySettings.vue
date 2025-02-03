<template>
    <div class="category-settings">
      <h3>Настройки категорий</h3>
      <div v-for="(setting, category) in categorySettings" :key="category" class="category-setting">
        <div class="category-header">
          <h4>{{ formatCategoryName(category) }}</h4>
          <span class="color-indicator" :style="{ backgroundColor: setting.color }"></span>
        </div>
        <div class="limit-input">
          <label>
            Лимит:
            <input type="number" v-model.number="localLimits[category]" />
          </label>
          <button @click="updateLimit(category)">Сохранить лимит</button>
        </div>
      </div>
      <div class="savings-goal">
        <h3>Цель накоплений</h3>
        <div class="goal-setting">
          <label>
            Целевая сумма:
            <input type="number" v-model.number="goalAmount" />
          </label>
          <button @click="setGoal">Установить цель</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useTransactionsStore } from '../../stores/transactions';
  
  export default {
    setup() {
      const transactionsStore = useTransactionsStore();
      const categorySettings = computed(() => transactionsStore.categorySettings);
      const localLimits = ref({});
      Object.keys(transactionsStore.categorySettings).forEach(category => {
        localLimits.value[category] = transactionsStore.categorySettings[category].limit;
      });
      const goalAmount = ref(transactionsStore.savingsGoal.goalAmount);
  
      const updateLimit = (category) => {
        transactionsStore.setCategoryLimit(category, localLimits.value[category]);
        alert(`Лимит для категории "${formatCategoryName(category)}" сохранён.`);
      };
  
      const setGoal = () => {
        transactionsStore.setSavingsGoal(goalAmount.value);
        alert('Цель накоплений установлена.');
      };
  
      const formatCategoryName = (name) => {
        // Преобразуем имя категории (например, "restaurant" -> "Ресторан")
        const map = {
          restaurant: 'Ресторан',
          transport: 'Транспорт',
          repair: 'Ремонт',
          groceries: 'Продукты',
        };
        return map[name] || name;
      };
  
      return { categorySettings, localLimits, updateLimit, goalAmount, setGoal, formatCategoryName };
    },
  };
  </script>
  
  <style scoped>
  .category-settings {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
  }
  
  .category-settings h3 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }
  
  .category-setting {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .category-header h4 {
    margin: 0;
    font-size: 16px;
    color: #444;
  }
  
  .color-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #ccc;
  }
  
  .limit-input label {
    font-size: 14px;
    color: #555;
    display: block;
    margin-bottom: 5px;
  }
  
  .limit-input input {
    width: 100%;
    padding: 6px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 5px;
  }
  
  .limit-input button {
    padding: 6px 12px;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .limit-input button:hover {
    background-color: #0056b3;
  }
  
  .savings-goal {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .goal-setting label {
    font-size: 14px;
    color: #555;
    display: block;
    margin-bottom: 5px;
  }
  
  .goal-setting input {
    width: 100%;
    padding: 6px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .goal-setting button {
    padding: 6px 12px;
    background-color: #28a745;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .goal-setting button:hover {
    background-color: #218838;
  }
  </style>
  