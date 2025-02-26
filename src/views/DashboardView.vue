<!-- src/views/DashboardView.vue -->
<template>
  <div>
    <h2 class="text-h4 mb-4">Dashboard Overview</h2>


    <metric-cards class="mb-6" />


    <v-row>
      <v-col cols="12" md="6">
        <stock-level-chart />
      </v-col>

      <v-col cols="12" md="6">
        <product-distribution-chart />
      </v-col>
    </v-row>


    <v-row class="mt-4">
      <v-col cols="12">
        <stock-trends-chart />
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <brand-distribution-chart />
      </v-col>
    </v-row>
    <v-row class="mt-4">
      <v-col cols="12">
        <product-dimensions-chart />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import MetricCards from '@/components/charts/MetricCards.vue'
import StockLevelChart from '@/components/charts/StockLevelChart.vue'
import ProductDistributionChart from '@/components/charts/ProductDistributionChart.vue'
import StockTrendsChart from '@/components/charts/StockTrendsChart.vue'
import BrandDistributionChart from '@/components/charts/BrandDistributionChart.vue'
import ProductDimensionsChart from '@/components/charts/ProductDimensionsChart.vue'
</script>
