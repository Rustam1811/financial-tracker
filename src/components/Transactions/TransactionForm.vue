<template>
  <div class="transaction-form">
    <h3>Добавить транзакцию</h3>
    <form @submit.prevent="submitTransaction">
      <div class="form-row">
        <div class="form-group fixed">
          <input v-model="description" type="text" placeholder="Описание" required />
        </div>
        <div class="form-group fixed">
          <input v-model.number="amount" type="number" placeholder="Сумма" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group fixed">
          <select v-model="type" required>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </div>
        <div class="form-group fixed">
          <select v-model="currency">
            <option v-for="(rate, code) in currencies" :key="code" :value="code">{{ code }}</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group fixed">
          <select v-model="category">
            <option value="restaurant">Ресторан</option>
            <option value="transport">Транспорт</option>
            <option value="repair">Ремонт</option>
            <option value="groceries">Продукты</option>
          </select>
        </div>
        <div class="form-group fixed checkbox-container">
          <label class="checkbox-label">
            <input type="checkbox" v-model="goal" /> Накопления
          </label>
        </div>
      </div>
      <div class="form-row" v-if="goal">
        <div class="form-group fixed">
          <input v-model.number="goalAmount" type="number" placeholder="Целевая сумма" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group fixed">
          <button type="submit">Добавить</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useTransactionsStore } from '../../stores/transactions';
import { v4 as uuidv4 } from 'uuid';

export default {
  emits: ['transaction-added'],
  setup(props, { emit }) {
    const description = ref('');
    const amount = ref(0);
    const type = ref('expense');
    const currency = ref('KZT');
    const category = ref('restaurant');
    const goalAmount = ref(null);
    const goal = ref(false);

    const transactionsStore = useTransactionsStore();
    const currencies = computed(() => transactionsStore.currencies);

    const submitTransaction = () => {
      const newTransaction = {
        id: uuidv4(),
        description: description.value,
        amount: amount.value,
        type: type.value,
        currency: currency.value,
        category: category.value,
        goalAmount: goalAmount.value,
        goal: goal.value,
        date: new Date().toISOString(),
      };

      transactionsStore.addTransaction(newTransaction);
      emit('transaction-added');

      // Сброс формы
      description.value = '';
      amount.value = 0;
      type.value = 'expense';
      currency.value = 'KZT';
      category.value = 'restaurant';
      goalAmount.value = null;
      goal.value = false;
    };

    return { description, amount, type, currency, category, currencies, submitTransaction, goalAmount, goal };
  },
};
</script>

<style scoped>
.transaction-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

h3 {
  font-family: 'Roboto', sans-serif;
  color: #444;
  margin-bottom: 15px;
  font-size: 20px;
}

/* Грид для выравнивания полей ввода */
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

/* Фиксированная ширина и высота для групп ввода */
.form-group.fixed {
  flex: 1;
  min-width: 140px;
  max-width: 200px;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 10px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  border-color: #007bff;
}

/* Для чекбокса */
.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-label {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #555;
}

button {
  width: 100%;
  padding: 10px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #218838;
}
</style>
