<!-- src/components/dashboard/MetricCards.vue -->
<template>
  <v-row>
    <v-col cols="12" sm="6" md="3">
      <v-card class="mx-auto">
        <v-card-text class="text-center">
          <v-icon size="36" color="primary" class="mb-2">mdi-package-variant</v-icon>
          <div class="text-h6">Total Articles</div>
          <div class="text-h4">{{ totalArticles }}</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card class="mx-auto">
        <v-card-text class="text-center">
          <v-icon size="36" color="error" class="mb-2">mdi-box</v-icon>
          <div class="text-h6">Total stock items</div>
          <div class="text-h4">{{ totalStockCount }}</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card class="mx-auto">
        <v-card-text class="text-center">
          <v-icon size="36" color="success" class="mb-2">mdi-account-group</v-icon>
          <div class="text-h6">Total Customers</div>
          <div class="text-h4">{{ totalCustomersCount }}</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card class="mx-auto">
        <v-card-text class="text-center">
          <v-icon size="36" color="info" class="mb-2">mdi-package-variant-closed</v-icon>
          <div class="text-h6">Total packaging </div>
          <div class="text-h4">{{ totalPackagingCount }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArticleService } from '@/services/ArticleService'
import { ArticleXAvailableStockService } from '@/services/ArticleXAvailableStockService'
import { ArticlePackagingBreakdownService } from '@/services/ArticlePackagingBreakdownService.js'
import { CustomerService } from '@/services/CustomerService.js'

const articleService = new ArticleService()
const stockService = new ArticleXAvailableStockService()
const packagingService = new ArticlePackagingBreakdownService()
const customerService = new CustomerService()

const totalArticles = ref(0)
const lowStockCount = ref(0)
const totalCustomersCount = ref(0)
const totalPackagingCount = ref(0)
const totalStockCount = ref(0)

const loadMetrics = async () => {
  try {
    const articleResponse = await articleService.getArticles({}, 1, 1)
    totalArticles.value = articleResponse.totalRecords

    const stockResponse = await stockService.getArticleXAvailableStocks({}, 1, 100)
    lowStockCount.value = stockResponse.data.filter(
      item => item.minimumStock && item.availableStock < item.minimumStock
    ).length

      const customerResponse = await customerService.getCustomers({}, 1, 1)
      totalCustomersCount.value = customerResponse.totalRecords

      const packagingResponse = await packagingService.getArticlePackagingBreakdowns({}, 1, 1)
      totalPackagingCount.value = packagingResponse.totalRecords

      const stockCountResponse = await stockService.getArticleXAvailableStocks({}, 1, 1)
      totalStockCount.value = stockCountResponse.totalRecords
  } catch (error) {
    console.error('Error loading metrics:', error)
  }
}

onMounted(() => {
  loadMetrics()
})
</script>
