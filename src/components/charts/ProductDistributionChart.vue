<!-- src/components/charts/ProductDistributionChart.vue -->
<template>
  <v-card>
    <v-card-title>Product Group Distribution</v-card-title>
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
import { PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ArticleService } from '@/services/ArticleService'


use([
  CanvasRenderer,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const articleService = new ArticleService()
const distributionData = ref([])
const loading = ref(true)
const error = ref(null)

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: distributionData.value
    }
  ]
}))

const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await articleService.getArticles(
      {},
      1,
      100
    )


    const groupCounts = response.data.reduce((acc, article) => {
      const group = article.productGroup || 'Uncategorized'
      acc[group] = (acc[group] || 0) + 1
      return acc
    }, {})


    distributionData.value = Object.entries(groupCounts).map(([name, value]) => ({
      name,
      value
    }))

  } catch (err) {
    error.value = err.message
    console.error('Error loading product distribution data:', err)
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
