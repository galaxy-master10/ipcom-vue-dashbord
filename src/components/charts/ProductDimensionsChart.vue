<!-- src/components/charts/ProductDimensionsChart.vue -->
<template>
  <v-card>
    <v-card-title>Product Dimensions Distribution</v-card-title>
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
import { ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ArticleService } from '@/services/ArticleService'


use([
  CanvasRenderer,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent
])

const articleService = new ArticleService()
const loading = ref(true)
const productsData = ref([])
const productGroups = ref([])

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: function(params) {
      return `<strong>${params.data.name}</strong><br/>` +
        `Diameter: ${params.data.diameter}mm<br/>` +
        `Thickness: ${params.data.thickness}mm<br/>` +
        `Product Group: ${params.data.group}`;
    }
  },
  legend: {
    data: productGroups.value,
    orient: 'vertical',
    right: 10,
    top: 20,
    type: 'scroll'
  },
  grid: {
    left: '3%',
    right: '15%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    name: 'Diameter (mm)',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    type: 'value',
    name: 'Thickness (mm)',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: 0,
      start: 0,
      end: 100
    },
    {
      type: 'slider',
      yAxisIndex: 0,
      start: 0,
      end: 100
    }
  ],
  series: productGroups.value.map(group => ({
    name: group,
    type: 'scatter',
    symbolSize: 10,
    emphasis: {
      focus: 'series',
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)'
      }
    },
    data: productsData.value
      .filter(item => item.group === group)
      .map(item => ({
        value: [item.diameter, item.thickness],
        name: item.name,
        diameter: item.diameter,
        thickness: item.thickness,
        group: item.group
      }))
  }))
}))

const loadData = async () => {
  try {
    loading.value = true
    const response = await articleService.getArticles({}, 1, 100)


    const validProducts = response.data.filter(item =>
      item.diameter !== null &&
      item.thickness !== null &&
      item.productGroup !== null
    )

    productsData.value = validProducts.map(item => ({
      name: item.description || `Article ${item.articleId}`,
      diameter: item.diameter,
      thickness: item.thickness,
      group: item.productGroup || 'Other'
    }))


    productGroups.value = [...new Set(productsData.value.map(item => item.group))]

  } catch (error) {
    console.error('Error loading product dimensions data:', error)
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
