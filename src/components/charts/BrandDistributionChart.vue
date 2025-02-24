<!-- src/components/charts/BrandDistributionChart.vue -->
<template>
  <v-card>
    <v-card-title>Product Distribution by Brand</v-card-title>
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
import { ArticleService } from '@/services/ArticleService'

// Register components
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const articleService = new ArticleService()
const loading = ref(true)
const brandData = ref([])

// Generate random colors for brands
const getRandomColor = () => {
  const colors = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853', // Google colors
    '#1976D2', '#D32F2F', '#FFC107', '#388E3C', // Material colors
    '#7B1FA2', '#C2185B', '#00796B', '#FFA000', // More material colors
    '#0097A7', '#303F9F', '#689F38', '#616161'  // Even more colors
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '8%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: brandData.value.map(item => item.name),
    axisLabel: {
      rotate: 45,
      interval: 0
    }
  },
  yAxis: {
    type: 'value',
    name: 'Number of Articles'
  },
  series: [
    {
      name: 'Articles',
      type: 'bar',
      data: brandData.value.map(item => ({
        value: item.count,
        itemStyle: {
          color: getRandomColor()
        }
      })),
      label: {
        show: true,
        position: 'top'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

const loadData = async () => {
  try {
    loading.value = true
    const response = await articleService.getArticles({}, 1, 100)


    const brandMap = new Map()

    response.data.forEach(article => {
      const brand = article.brand || 'Unknown'
      if (!brandMap.has(brand)) {
        brandMap.set(brand, 0)
      }
      brandMap.set(brand, brandMap.get(brand) + 1)
    })


    brandData.value = Array.from(brandMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  } catch (error) {
    console.error('Error loading brand distribution:', error)
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
