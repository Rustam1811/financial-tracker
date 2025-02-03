import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransactionsStore = defineStore('transactions', {
    state: () => ({
        transactions: [],
        currencies: {},
    }),
    actions: {
        async fetchTransactions() {
            const data = localStorage.getItem('transactions');
            this.transactions = data ? JSON.parse(data) : [];
        },
        addTransaction(transaction) {
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
        convertToBase(amount, currency, base = 'USD') {
            if (currency === base) return amount;
            const rate = this.currencies[currency];
            const baseRate = this.currencies[base];
            if (rate && baseRate) {
                return (amount / rate) * baseRate;
            }
            return amount;
        },
    },
});
