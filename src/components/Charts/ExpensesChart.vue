<template>
  <div>
    <h3>График расходов и доходов</h3>
    <button @click="toggleChartType" class="toggle-btn">
      Переключить график
    </button>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  props: {
    transactions: Array,
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;
    const chartType = ref('bar'); 

    const generateChartData = () => {
      const expenses = props.transactions.filter(t => t.type === 'expense');
      const incomes = props.transactions.filter(t => t.type === 'income');

      // Обработка расходов
      const expenseCategories = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const month = `${date.getMonth() + 1}-${date.getFullYear()}`;
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
      }, {});

      // Обработка доходов
      const incomeCategories = incomes.reduce((acc, income) => {
        const date = new Date(income.date);
        const month = `${date.getMonth() + 1}-${date.getFullYear()}`;
        acc[month] = (acc[month] || 0) + income.amount;
        return acc;
      }, {});

      return {
        labels: [...new Set([...Object.keys(expenseCategories), ...Object.keys(incomeCategories)])],
        datasets: [
          {
            label: 'Расходы',
            data: Object.keys(expenseCategories).map(month => expenseCategories[month] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Доходы',
            data: Object.keys(incomeCategories).map(month => incomeCategories[month] || 0),
            backgroundColor: '#28a745',
          },
        ],
      };
    };

    const renderChart = () => {
      const data = generateChartData();
      if (chartInstance) {
        chartInstance.data = data;
        chartInstance.type = chartType.value; 
        chartInstance.update();
      } else {
        chartInstance = new Chart(chartCanvas.value, {
          type: chartType.value,
          data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Доходы и Расходы по месяцам',
              },
            },
          },
        });
      }
    };

    const toggleChartType = () => {
      chartType.value = chartType.value === 'bar' ? 'pie' : 'bar'; 
      renderChart();
    };

    onMounted(() => {
      renderChart();
    });

    watch(
      () => props.transactions,
      () => {
        renderChart();
      },
      { deep: true }
    );

    return { chartCanvas, toggleChartType };
  },
};
</script>

<style scoped>
.toggle-btn {
  margin: 10px 0;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-btn:hover {
  background-color: #0056b3;
}
</style>
