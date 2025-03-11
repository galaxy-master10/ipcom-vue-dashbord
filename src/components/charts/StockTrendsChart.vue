<!-- src/components/charts/StockTrendsChart.vue -->
<template>
  <v-card>
    <v-card-title>Stock Trends by Location</v-card-title>
    <v-card-text>
      <div v-if="loading" class="d-flex justify-center">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <v-chart
        v-else
        class="chart"
        :style="{ height: '400px', width: '100%' }"
        :option="chartOption"
        autoresize
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ArticleXAvailableStockService } from '@/services/ArticleXAvailableStockService'
import { useTheme } from 'vuetify'


use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const stockService = new ArticleXAvailableStockService()
const loading = ref(true)
const stockData = ref([])
const theme = useTheme()


const isDarkMode = computed(() => {
  return theme.global.name.value === 'dark'
})


const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['Available Stock', 'Actual Stock', 'Minimum Stock'],
    textStyle: {
      color: isDarkMode.value ? '#FFFFFF' : '#333333'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: stockData.value.map(item => `Location ${item.companyStockLocationId}`),
    axisLabel: {
      rotate: 45,
      textStyle: {
        color: isDarkMode.value ? '#FFFFFF' : '#000000'
      }
    },

  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Available Stock',
      type: 'line',
      data: stockData.value.map(item => item.availableStock),
      smooth: true,
      color: '#4CAF50'
    },
    {
      name: 'Actual Stock',
      type: 'line',
      data: stockData.value.map(item => item.actualStock),
      smooth: true,
      color: '#2196F3'
    },
    {
      name: 'Minimum Stock',
      type: 'line',
      data: stockData.value.map(item => item.minimumStock),
      smooth: true,
      color: '#FFA726'
    }
  ]
}))

const loadData = async () => {
  try {
    loading.value = true
    const response = await stockService.getArticleXAvailableStocks({}, 1, 10)
    stockData.value = response.data
  } catch (error) {
    console.error('Error loading stock trends:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.chart {
  min-height: 400px;
}
</style>
