<!-- src/components/charts/StockRankingChart.vue -->
<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span>Articles Ranked by Stock Level</span>
      <v-spacer></v-spacer>
      <v-select
        v-model="stockMetric"
        :items="stockMetrics"
        density="compact"
        label="Metric"
        style="max-width: 200px"
      ></v-select>
      <v-select
        v-model="displayCount"
        :items="displayCounts"
        density="compact"
        label="Display Count"
        style="max-width: 150px; margin-left: 8px"
      ></v-select>
    </v-card-title>
    <v-card-text>
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      <v-chart
        v-else
        class="chart"
        :style="{ height: '500px', width: '100%' }"
        :option="chartOption"
        autoresize
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  MarkLineComponent
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
  TitleComponent,
  DataZoomComponent,
  MarkLineComponent
])


const stockService = new ArticleXAvailableStockService()
const articleService = new ArticleService()


const stockData = ref([])
const loading = ref(true)
const error = ref(null)
const theme = useTheme()
const stockMetric = ref('availableStock')
const stockMetrics = [
  { title: 'Available Stock', value: 'availableStock' },
  { title: 'Actual Stock', value: 'actualStock' }
]
const displayCount = ref(20)
const displayCounts = [10, 20, 50, 100]

const isDarkMode = computed(() => {
  return theme.global.name.value === 'dark'
})


const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    const stockResponse = await stockService.getArticleXAvailableStocks(
      {},
      1,
      1000
    )

    const articleIds = [...new Set(stockResponse.data.map(item => item.articleId))]
    const articlesResponse = await articleService.getArticles(
      { ids: articleIds },
      1,
      articleIds.length
    )

    const articleMap = new Map(
      articlesResponse.data.map(article => [article.articleId, article])
    )

    const articleStockMap = new Map()

    stockResponse.data.forEach(stockItem => {
      const { articleId, availableStock, actualStock, minimumStock, maximumStock } = stockItem

      if (!articleStockMap.has(articleId)) {
        articleStockMap.set(articleId, {
          articleId,
          availableStock: 0,
          actualStock: 0,
          minimumStock: null,
          maximumStock: null,
          locations: 0
        })
      }

      const current = articleStockMap.get(articleId)
      current.availableStock += availableStock || 0
      current.actualStock += actualStock || 0
      current.locations += 1


      if (minimumStock !== null && current.minimumStock === null) {
        current.minimumStock = minimumStock
      }

      if (maximumStock !== null && current.maximumStock === null) {
        current.maximumStock = maximumStock
      }
    })


    stockData.value = Array.from(articleStockMap.values())
      .map(stockItem => {
        const article = articleMap.get(stockItem.articleId)
        return {
          ...stockItem,
          code: article?.code || '',
          description: article?.description || `Article ${stockItem.articleId}`,
          product: article?.product || '',
          displayName: article ? `${article.code} - ${article.description?.substring(0, 30)}` : `Article ${stockItem.articleId}`
        }
      })
      .sort((a, b) => b[stockMetric.value] - a[stockMetric.value])

  } catch (err) {
    error.value = 'Error loading data: ' + err.message
    console.error('Error loading stock and article data:', err)
  } finally {
    loading.value = false
  }
}

const filteredData = computed(() => {
  const sorted = [...stockData.value]
    .sort((a, b) => b[stockMetric.value] - a[stockMetric.value])
    .slice(0, displayCount.value)

  return sorted
})

const chartOption = computed(() => {
  if (!filteredData.value.length) return {}

  const data = filteredData.value


  const categories = data.map(item => item.displayName)
  const values = data.map(item => item[stockMetric.value])
  const minStock = data.map(item => item.minimumStock)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const item = data[params[0].dataIndex]
        let html = `<div style="font-weight: bold">${item.displayName}</div>`
        html += `<div>Code: ${item.code}</div>`
        html += `<div>Available Stock: ${item.availableStock}</div>`

        if (item.minimumStock !== null) {
          html += `<div>Minimum Stock: ${item.minimumStock}</div>`
        }

        if (item.maximumStock !== null) {
          html += `<div>Maximum Stock: ${item.maximumStock}</div>`
        }

        return html
      }
    },
    legend: {
      data: ['Stock Level', 'Minimum Stock'],
      textStyle: {
        color: isDarkMode.value ? '#FFFFFF' : '#333333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: stockMetric.value === 'availableStock' ? 'Available Stock' : 'Actual Stock',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        width: 120,
        overflow: 'truncate',
        interval: 0,
        color: isDarkMode.value ? '#EEEEEE' : '#333333'
      }
    },
    dataZoom: [
      {
        type: 'inside',
        orient: 'vertical',
        startValue: 0,
        endValue: Math.min(15, data.length - 1)
      },
      {
        type: 'slider',
        orient: 'vertical',
        showDataShadow: false,
        startValue: 0,
        endValue: Math.min(15, data.length - 1)
      }
    ],
    series: [
      {
        name: 'Stock Level',
        type: 'bar',
        data: values,
        color: function(params) {
          const item = data[params.dataIndex]

          if (item.minimumStock !== null && item[stockMetric.value] < item.minimumStock) {
            return '#FF5252'
          } else if (item.maximumStock !== null && item[stockMetric.value] > item.maximumStock) {
            return '#64B5F6'
          } else {
            return '#0f9a91'
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}',
          color: isDarkMode.value ? '#FFFFFF' : '#333333',
          fontWeight: 'bold'
        },
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: '#4CAF50'
        }
      },
      {
        name: 'Minimum Stock',
        type: 'bar',
        data: minStock,
        color: '#FFB74D',
        barGap: '-100%',
        z: -1,
        label: {
          show: false
        },
        itemStyle: {
          opacity: 0.5,
          borderRadius: [0, 4, 4, 0]
        }
      }
    ]
  }
})


watch([stockMetric, displayCount], () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.chart {
  min-height: 500px;
}
.error-message {
  color: red;
  padding: 16px;
  text-align: center;
}
</style>
