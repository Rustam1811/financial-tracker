<template>
  <li class="transaction-item">
    <div class="transaction-info">
      <span class="transaction-description">{{ transaction.description }}</span>
      <span class="transaction-date">{{ formattedDate }}</span>
    </div>
    <div class="transaction-actions">
      <span :class="amountClass">{{ transaction.amount }} {{ transaction.currency }}</span>
      <button @click="toggleEdit" class="edit-button">
        {{ editMode ? 'Сохранить' : 'Редактировать' }}
      </button>
      <button @click="deleteTrans" class="delete-button">Удалить</button>
    </div>
    
    <div v-if="editMode" class="edit-form">
      <input v-model="editedDescription" type="text" />
      <input v-model.number="editedAmount" type="number" />
      <select v-model="editedType">
        <option value="income">Доход</option>
        <option value="expense">Расход</option>
      </select>
      <select v-model="editedCurrency">
        <option v-for="(rate, code) in currencies" :key="code" :value="code">{{ code }}</option>
      </select>
      <button @click="saveEdit" class="save-button">Сохранить</button>
    </div>
  </li>
</template>

<script>
import { ref, computed } from 'vue';
import { useTransactionsStore } from '../../stores/transactions';

export default {
  props: {
    transaction: Object,
  },
  emits: ['update', 'delete'],
  setup(props, { emit }) {
    const editMode = ref(false);
    const editedDescription = ref(props.transaction.description);
    const editedAmount = ref(props.transaction.amount);
    const editedType = ref(props.transaction.type);
    const editedCurrency = ref(props.transaction.currency);

    const transactionsStore = useTransactionsStore();
    const currencies = computed(() => transactionsStore.currencies);

    const formattedDate = computed(() => {
      const date = new Date(props.transaction.date);
      return date.toLocaleDateString();
    });

    const amountClass = computed(() => {
      return props.transaction.type === 'income' ? 'income-text' : 'expense-text';
    });

    const saveEdit = () => {
      const updatedTransaction = {
        ...props.transaction,
        description: editedDescription.value,
        amount: editedAmount.value,
        type: editedType.value,
        currency: editedCurrency.value,
      };
      transactionsStore.updateTransaction(updatedTransaction);
      editMode.value = false;
      emit('update');
    };

    const deleteTrans = () => {
      transactionsStore.deleteTransaction(props.transaction.id);
      emit('delete');
    };

    const toggleEdit = () => {
      editMode.value = !editMode.value;
    };

    return {
      editMode,
      editedDescription,
      editedAmount,
      editedType,
      editedCurrency,
      currencies,
      formattedDate,
      amountClass,
      saveEdit,
      deleteTrans,
      toggleEdit,
    };
  },
};
</script>

<style scoped>
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 5px;
  border-left: 4px solid #28a745;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.transaction-item.expense {
  border-left-color: #dc3545;
}

.transaction-info {
  display: flex;
  flex-direction: column;
}

.transaction-description {
  font-weight: bold;
}

.transaction-date {
  color: #666;
  font-size: 14px;
}

.transaction-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-button,
.delete-button,
.save-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.edit-button {
  background-color: #f0ad4e;
  color: white;
}

.edit-button:hover {
  background-color: #ec971f;
}

.delete-button {
  background-color: #d9534f;
  color: white;
}

.delete-button:hover {
  background-color: #c9302c;
}

.save-button {
  background-color: #5cb85c;
  color: white;
}

.save-button:hover {
  background-color: #4cae4c;
}

.income-text {
  color: #28a745;
  font-weight: bold;
}

.expense-text {
  color: #dc3545;
  font-weight: bold;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
</style>
