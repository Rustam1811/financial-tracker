<template>
  <div class="chart-container">
    <h3>Разбивка расходов по категориям</h3>
    <button @click="toggleChartType" class="toggle-btn">
      Переключить график ({{ chartType === 'bar' ? 'Круговой' : 'Столбчатый' }})
    </button>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useTransactionsStore } from '../../stores/transactions';

Chart.register(...registerables);

export default {
  props: {
    transactions: Array,
  },
  setup(props) {
    const transactionsStore = useTransactionsStore();
    const chartCanvas = ref(null);
    let chartInstance = null;
    const chartType = ref('bar');

    
    const generateChartData = () => {
     
      const expenseTransactions = props.transactions.filter(t => t.type === 'expense');

      
      const groups = expenseTransactions.reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});

      const labels = [];
      const data = [];
      const backgroundColors = [];

      
      const categoryNames = {
        restaurant: 'Ресторан',
        transport: 'Транспорт',
        repair: 'Ремонт',
        groceries: 'Продукты',
        salary: 'Зарплата',
        
      };

      Object.keys(groups).forEach(category => {
        labels.push(categoryNames[category] || category);
        data.push(groups[category]);
        const setting = transactionsStore.categorySettings[category];
        backgroundColors.push(setting ? setting.color : '#ccc');
      });

      return {
        labels,
        datasets: [
          {
            label: 'Расходы по категориям',
            data,
            backgroundColor: backgroundColors,
          },
        ],
      };
    };

    const generatePieChartData = () => {
      const incomeTransactions = props.transactions.filter(t => t.type === 'income');
      const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
      const expenseTransactions = props.transactions.filter(t => t.type === 'expense');
      const groups = expenseTransactions.reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});

      let totalExpenses = 0;
      const labels = [];
      const data = [];
      const backgroundColors = [];

      const categoryNames = {
        restaurant: 'Ресторан',
        transport: 'Транспорт',
        repair: 'Ремонт',
        groceries: 'Продукты',
        salary: 'Зарплата',
      };

      Object.keys(groups).forEach(category => {
        labels.push(categoryNames[category] || category);
        data.push(groups[category]);
        totalExpenses += groups[category];
        const setting = transactionsStore.categorySettings[category];
        backgroundColors.push(setting ? setting.color : '#ccc');
      });

      const remainder = totalIncome - totalExpenses;
      if (remainder > 0) {
        labels.push('Остаток');
        data.push(remainder);
        backgroundColors.push('#e0e0e0'); 
      }

      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: backgroundColors,
          },
        ],
      };
    };

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      if (chartType.value === 'pie') {
        chartInstance = new Chart(chartCanvas.value, {
          type: 'pie',
          data: generatePieChartData(),
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'Доход с распределением расходов (Круговая диаграмма)',
                font: { size: 18 },
              },
            },
          },
        });
      } else {
        chartInstance = new Chart(chartCanvas.value, {
          type: 'bar',
          data: generateChartData(),
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: 'Расходы по категориям (Столбчатый график)',
                font: { size: 18 },
              },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }
    };

    const toggleChartType = () => {
      chartType.value = chartType.value === 'bar' ? 'pie' : 'bar';
      renderChart();
    };

    onMounted(renderChart);
    watch(() => props.transactions, renderChart, { deep: true });

    return { chartCanvas, toggleChartType, chartType };
  },
};
</script>

<style scoped>
.chart-container {
  background: #f7f9fc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

h3 {
  font-family: 'Roboto', sans-serif;
  color: #333;
  margin-bottom: 10px;
}

.toggle-btn {
  margin-bottom: 15px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-btn:hover {
  background-color: #0056b3;
}
</style>
