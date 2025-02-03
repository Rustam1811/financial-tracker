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
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.transactions-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.transactions-list li {
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 8px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #28a745;
}

.transactions-list li.expense {
  border-left-color: #dc3545;
}

.transactions-list li:hover {
  background: #f1f1f1;
}


@media (max-width: 600px) {
  .transactions-container {
    padding: 15px;
  }

  h3 {
    font-size: 18px;
  }

  .transactions-list li {
    padding: 10px;
    flex-direction: column;
    align-items: flex-start;
  }

  .transactions-list li .actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .transactions-list li .actions button {
    width: 48%;
  }
}
</style>
