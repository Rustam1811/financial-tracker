<template>
  <div class="home-container">
    <Navbar />
    <h1 class="title">Личный Финансовый Трекер</h1>
    
    <!-- Остальной контент личного бюджета -->
    <TransactionForm @transaction-added="refreshTransactions" />
    <TransactionList
      @transaction-updated="refreshTransactions"
      @transaction-deleted="refreshTransactions"
    />
    <ExpensesChart :transactions="transactions" />
    
    <!-- Кнопка для открытия семейного бюджета -->
    <div class="family-budget-btn-container">
      <button class="family-budget-btn" @click="openFamilyBudget">
        Семейный бюджет
      </button>
    </div>
    
    <!-- Модальное окно семейного бюджета -->
    <FamilyBudget v-if="showFamilyBudget" @close="closeFamilyBudget" />
    
    <!-- Раздел настроек (если требуется) -->
    <div class="settings-section">
      <h2>Настройки категорий</h2>
      <CategorySettings />
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from 'vue';
import { useTransactionsStore } from '../stores/transactions';
import Navbar from '../components/Navbar.vue';
import TransactionForm from '../components/Transactions/TransactionForm.vue';
import TransactionList from '../components/Transactions/TransactionList.vue';
import ExpensesChart from '../components/Charts/ExpensesChart.vue';
import CategorySettings from '../components/Transactions/CategorySettings.vue';
import FamilyBudget from '../components/FamilyBudget.vue'; // новый компонент

export default {
  components: {
    Navbar,
    TransactionForm,
    TransactionList,
    ExpensesChart,
    CategorySettings,
    FamilyBudget,
  },
  setup() {
    const transactionsStore = useTransactionsStore();
    const showFamilyBudget = ref(false);

    const refreshTransactions = async () => {
      await transactionsStore.fetchTransactions();
    };

    onMounted(() => {
      transactionsStore.fetchTransactions();
      transactionsStore.fetchCurrencies();
    });

    const transactions = computed(() => transactionsStore.transactions);

    const openFamilyBudget = () => {
      showFamilyBudget.value = true;
    };

    const closeFamilyBudget = () => {
      showFamilyBudget.value = false;
    };

    return { transactions, refreshTransactions, showFamilyBudget, openFamilyBudget, closeFamilyBudget };
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
.family-budget-btn-container {
  margin: 20px 0;
}
.family-budget-btn {
  padding: 12px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.family-budget-btn:hover {
  background-color: #218838;
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
