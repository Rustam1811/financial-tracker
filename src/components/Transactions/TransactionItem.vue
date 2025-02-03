<template>
  <li class="transaction-item">
    <div class="transaction-info">
      <span class="transaction-description">
        {{ transaction.description }} ({{ transaction.category }})
      </span>
      <span class="transaction-date">{{ formattedDate }}</span>
    </div>
    <div class="transaction-actions">
      <span :style="{ color: categoryColor }" class="transaction-amount">
        {{ transaction.amount }} {{ transaction.currency }}
      </span>
      <button @click="toggleEdit" class="action-btn edit-btn">
        {{ editMode ? 'Сохранить' : 'Редактировать' }}
      </button>
      <button @click="deleteTrans" class="action-btn delete-btn">Удалить</button>
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
      <button @click="saveEdit" class="save-btn">Сохранить</button>
    </div>
    <div v-if="transaction.goalAmount && transaction.amount >= transaction.goalAmount" class="goal-notice">
      <p>Цель достигнута! Ваши накопления на путешествие почти завершены!</p>
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
    const editedCategory = ref(props.transaction.category);

    const transactionsStore = useTransactionsStore();
    const currencies = computed(() => transactionsStore.currencies);

    const formattedDate = computed(() => {
      const date = new Date(props.transaction.date);
      return date.toLocaleDateString();
    });

    const categoryColor = computed(() => {
      const setting = transactionsStore.categorySettings[props.transaction.category];
      return setting ? setting.color : '#000';
    });

    const saveEdit = () => {
      const updatedTransaction = {
        ...props.transaction,
        description: editedDescription.value,
        amount: editedAmount.value,
        type: editedType.value,
        currency: editedCurrency.value,
        category: editedCategory.value,
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
      editedCategory,
      currencies,
      formattedDate,
      categoryColor,
      saveEdit,
      deleteTrans,
      toggleEdit,
    };
  },
};
</script>

<style scoped>
.transaction-item {
  background: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: 'Roboto', sans-serif;
  transition: transform 0.2s ease;
}
.transaction-item:hover {
  transform: translateY(-2px);
}
.transaction-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.transaction-description {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.transaction-date {
  font-size: 13px;
  color: #777;
}
.transaction-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.transaction-amount {
  font-size: 18px; /* увеличенный размер, чтобы соответствовать форме */
  font-weight: bold;
}
.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.edit-btn {
  background-color: #ffc107;
  color: #fff;
}
.edit-btn:hover {
  background-color: #e0a800;
}
.delete-btn {
  background-color: #dc3545;
  color: #fff;
}
.delete-btn:hover {
  background-color: #c82333;
}
.edit-form {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.edit-form input,
.edit-form select {
  padding: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
}
.save-btn {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.save-btn:hover {
  background-color: #218838;
}
.goal-notice {
  margin-top: 10px;
  padding: 10px;
  background-color: #d4edda;
  border-left: 4px solid #28a745;
  border-radius: 4px;
  font-size: 14px;
  color: #155724;
}
</style>
