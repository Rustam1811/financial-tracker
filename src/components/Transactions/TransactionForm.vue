<template>
  <div class="transaction-form">
    <h3>Добавить транзакцию</h3>
    <form @submit.prevent="submitTransaction">
      <div class="form-group">
        <input v-model="description" type="text" placeholder="Описание" required />
      </div>
      <div class="form-group">
        <input v-model.number="amount" type="number" placeholder="Сумма" required />
      </div>
      <div class="form-group">
        <select v-model="type" required>
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>
      </div>
      <div class="form-group">
        <select v-model="currency">
          <option v-for="(rate, code) in currencies" :key="code" :value="code">{{ code }}</option>
        </select>
      </div>
      <div>
        <button type="submit">Добавить</button>
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
    const currency = ref('USD');

    const transactionsStore = useTransactionsStore();
    const currencies = computed(() => transactionsStore.currencies);

    const submitTransaction = () => {
      const newTransaction = {
        id: uuidv4(),
        description: description.value,
        amount: amount.value,
        type: type.value,
        currency: currency.value,
        date: new Date().toISOString(),
      };
      transactionsStore.addTransaction(newTransaction);
      emit('transaction-added');

      // Сброс формы
      description.value = '';
      amount.value = 0;
      type.value = 'expense';
      currency.value = 'USD';
    };

    return { description, amount, type, currency, currencies, submitTransaction };
  },
};
</script>

<style scoped>
.transaction-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

button {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #218838;
}
</style>
