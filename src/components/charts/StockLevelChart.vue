<!-- src/components/charts/StockLevelChart.vue -->
<template>
  <v-card>
    <v-card-title>Stock Levels Overview</v-card-title>
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
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ArticleXAvailableStockService } from '@/services/ArticleXAvailableStockService'
import { ArticleService } from '@/services/ArticleService'
import { useTheme } from 'vuetify'


use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const stockService = new ArticleXAvailableStockService()
const articleService = new ArticleService()

const stockData = ref([])
const loading = ref(true)
const error = ref(null)
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
    data: ['Current Stock', 'Minimum Stock'],
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
    data: stockData.value.map(item => item.description?.substring(0, 20) + '...' || `Article ${item.articleId}`),
    axisLabel: {
      rotate: 45
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Current Stock',
      type: 'bar',
      data: stockData.value.map(item => item.availableStock),
      color: '#4CAF50'
    },
    {
      name: 'Minimum Stock',
      type: 'bar',
      data: stockData.value.map(item => item.minimumStock),
      color: '#FFA726'
    }
  ]
}))

const loadData = async () => {
  try {
    loading.value = true
    error.value = null


    const stockResponse = await stockService.getArticleXAvailableStocks(
      {},
      1,
      10
    )


    const articlesResponse = await articleService.getArticles(
      {},
      1,
      100
    )


    stockData.value = stockResponse.data
      .filter(stock => stock.minimumStock !== null)
      .map(stock => ({
        ...stock,
        description: articlesResponse.data.find(a => a.articleId === stock.articleId)?.description
      }))
      .slice(0, 10)

  } catch (err) {
    error.value = err.message
    console.error('Error loading stock data:', err)
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
