import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    currencies: {},
    
    categorySettings: {
      restaurant: { color: '#FF5733', limit: null },
      transport: { color: '#33FFCE', limit: null },
      repair: { color: '#335BFF', limit: null },
      groceries: { color: '#FF33A8', limit: null },
      salary: { color: '#ff22A9', limit: null },
      // можно добавить и другие категории
    },
    
    savingsGoal: {
      amount: 0,     
      goalAmount: 0, 
    },
  }),
  actions: {
    async fetchTransactions() {
      const data = localStorage.getItem('transactions');
      this.transactions = data ? JSON.parse(data) : [];
    },
    addTransaction(transaction) {
      
      if (transaction.type === 'expense') {
        const categorySetting = this.categorySettings[transaction.category];
        if (categorySetting && categorySetting.limit && transaction.amount > categorySetting.limit) {
          alert('Ой ой, теперь нам придётся затянуть пояса и вытащить из бережений!');
        }
      }

      
      if (transaction.goal) {
        if (transaction.type === 'expense') {
          alert('Ваша цель стала дальше на пару месяцев.');
          this.savingsGoal.amount -= transaction.amount;
        } else if (transaction.type === 'income') {
          alert('Вы приблизились к цели!');
          this.savingsGoal.amount += transaction.amount;
        }
      }

      this.transactions.push(transaction);
      this.saveTransactions();
    },
    updateTransaction(updatedTransaction) {
      const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
      if (index !== -1) {
        this.transactions[index] = updatedTransaction;
        this.saveTransactions();
      }
    },
    deleteTransaction(id) {
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.saveTransactions();
    },
    saveTransactions() {
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
    },
    async fetchCurrencies() {
      try {
        const response = await axios.get('https://www.nbrb.by/api/exrates/rates?periodicity=0');
        this.currencies = response.data.reduce((acc, currency) => {
          acc[currency.Cur_Abbreviation] = currency.Cur_OfficialRate;
          return acc;
        }, {});
      } catch (error) {
        console.error('Ошибка при получении валют:', error);
      }
    },
    convertToBase(amount, currency, base = 'KZT') {
      if (currency === base) return amount;
      const rate = this.currencies[currency];
      const baseRate = this.currencies[base];
      if (rate && baseRate) {
        return (amount / rate) * baseRate;
      }
      return amount;
    },
    
    calculateGoalProgress(transaction) {
      if (transaction.goalAmount && transaction.amount >= transaction.goalAmount) {
        alert(`Цель накопления достигнута! Ваши накопления на ${transaction.description} завершены.`);
      } else if (transaction.goalAmount) {
        const progress = (transaction.amount / transaction.goalAmount) * 100;
        return progress.toFixed(2);
      }
      return null;
    },
    
    setCategoryLimit(category, limit) {
      if (this.categorySettings[category]) {
        this.categorySettings[category].limit = limit;
      }
    },
    
    setSavingsGoal(goalAmount) {
      this.savingsGoal.goalAmount = goalAmount;
      this.savingsGoal.amount = 0;
    },
  },
});
