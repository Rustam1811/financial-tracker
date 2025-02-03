<template>
  <div class="transactions-container">
    <h3>Список транзакций</h3>
    <ul class="transactions-list">
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
        @update="updateTransaction"
        @delete="deleteTransaction"
      />
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useTransactionsStore } from '../../stores/transactions';
import TransactionItem from './TransactionItem.vue';

export default {
  components: { TransactionItem },
  emits: ['transaction-updated', 'transaction-deleted'],
  setup(props, { emit }) {
    const transactionsStore = useTransactionsStore();
    const transactions = computed(() => transactionsStore.transactions);

    const updateTransaction = () => {
      emit('transaction-updated');
    };

    const deleteTransaction = () => {
      emit('transaction-deleted');
    };

    return { transactions, updateTransaction, deleteTransaction };
  },
};
</script>

<style scoped>
.transactions-container {
  background: #f1f4f8;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

h3 {
  font-family: 'Roboto', sans-serif;
  color: #333;
  margin-bottom: 15px;
  font-size: 20px;
}

.transactions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
