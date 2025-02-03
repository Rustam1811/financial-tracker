<template>
  <div class="home-container">
    <Navbar />
    <h1 class="title">Личный Финансовый Трекер</h1>
    <TransactionForm @transaction-added="refreshTransactions" />
    <TransactionList @transaction-updated="refreshTransactions" @transaction-deleted="refreshTransactions" />
    <ExpensesChart :transactions="transactions" />
  </div>
</template>

<script>
import { onMounted, computed } from 'vue';
import { useTransactionsStore } from '../stores/transactions';
import Navbar from '../components/Navbar.vue';
import TransactionForm from '../components/Transactions/TransactionForm.vue';
import TransactionList from '../components/Transactions/TransactionList.vue';
import ExpensesChart from '../components/Charts/ExpensesChart.vue';

export default {
  components: { Navbar, TransactionForm, TransactionList, ExpensesChart },
  setup() {
    const transactionsStore = useTransactionsStore();

    const refreshTransactions = async () => {
      await transactionsStore.fetchTransactions();
    };

    onMounted(() => {
      transactionsStore.fetchTransactions();
      transactionsStore.fetchCurrencies();
    });

    const transactions = computed(() => transactionsStore.transactions);

    return { transactions, refreshTransactions };
  },
};
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .home-container {
    width: 90%;
    padding: 15px;
  }
}
</style>
