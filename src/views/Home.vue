<template>
  <div class="home-container">
    <Navbar />
    <h1 class="title">Личный Финансовый Трекер</h1>
    <TransactionForm @transaction-added="refreshTransactions" />
    <TransactionList
      @transaction-updated="refreshTransactions"
      @transaction-deleted="refreshTransactions"
    />
    <ExpensesChart :transactions="transactions" />
    <div class="settings-section">
      <h2>Настройки категорий</h2>
      <CategorySettings />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue';
import { useTransactionsStore } from '../stores/transactions';
import Navbar from '../components/Navbar.vue';
import TransactionForm from '../components/Transactions/TransactionForm.vue';
import TransactionList from '../components/Transactions/TransactionList.vue';
import ExpensesChart from '../components/Charts/ExpensesChart.vue';
import CategorySettings from '../components/Transactions/CategorySettings.vue';

export default {
  components: {
    Navbar,
    TransactionForm,
    TransactionList,
    ExpensesChart,
    CategorySettings,
  },
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
  margin: 30px auto;
  padding: 20px;
  background: #fdfdfd;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 25px;
}

.settings-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #eee;
}

@media (max-width: 768px) {
  .home-container {
    width: 90%;
    padding: 15px;
  }
}
</style>
