<!-- src/views/ArticleXAvailableStockView.vue -->
<template>
  <div>
    <TableFilterSection
      :available-columns="visibleHeaders"
      v-model:filters="filters"
      @update:filters="handleFilters"
    />
    <v-divider class="mb-4 mt-4"></v-divider>
    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <BaseDataTable
      :title="title"
      :items="stocks"
      :loading="loading"
      :pagination="pagination"
      :visible-headers="visibleHeaders"
      :all-headers="allHeaders"
      v-model:visibleColumnKeys="visibleColumnKeys"
      @update:page="handlePageChange"
      @update:pageSize="handleItemsPerPageChange"
    ></BaseDataTable>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArticleXAvailableStockService } from '../services/ArticleXAvailableStockService.js'
import TableFilterSection from '@/components/TableFilterSection.vue'
import BaseDataTable from '@/components/BaseDataTable.vue'

const stockService = new ArticleXAvailableStockService()

// State Management
const loading = ref(true)
const search = ref('')
const filters = ref([])
const stocks = ref([])
const error = ref(null)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
})

// Column Definitions
const allHeaders = [
  // Keys
  { title: 'Article ID', key: 'articleId', sortable: true, category: 'Primary' },
  { title: 'Company Stock Location ID', key: 'companyStockLocationId', sortable: true, category: 'Primary' },

  // Stock Information
  { title: 'Available Stock', key: 'availableStock', sortable: true, category: 'Stock Info' },
  { title: 'Actual Stock', key: 'actualStock', sortable: true, category: 'Stock Info' },
  { title: 'Minimum Stock', key: 'minimumStock', sortable: true, category: 'Limits' },
  { title: 'Maximum Stock', key: 'maximumStock', sortable: true, category: 'Limits' }
]

const visibleColumnKeys = ref([
  'articleId',
  'companyStockLocationId',
  'availableStock',
  'actualStock',
  'minimumStock',
  'maximumStock'
])

const visibleHeaders = computed(() => {
  return allHeaders.filter(h => visibleColumnKeys.value.includes(h.key))
})

const title = 'Article Available Stock'

const fetchStocks = async () => {
  try {
    loading.value = true
    const filterParams = {
      ...filters.value.reduce((acc, filter) => ({
        ...acc,
        [filter.column]: filter.value
      }), {}),
      search: search.value
    }

    const response = await stockService.getArticleXAvailableStocks(
      filterParams,
      pagination.value.currentPage,
      pagination.value.pageSize
    )

    stocks.value = response.data
    pagination.value = {
      currentPage: response.pageNumber,
      pageSize: response.pageSize,
      totalItems: response.totalRecords,
      totalPages: response.totalPages
    }

    error.value = null
  } catch (err) {
    error.value = err.message
    stocks.value = []
  } finally {
    loading.value = false
  }
}

const handleFilters = async (newFilters) => {
  filters.value = [...newFilters]
  pagination.value.currentPage = 1
  await fetchStocks()
}

const handlePageChange = async (newPage) => {
  pagination.value.currentPage = newPage
  await fetchStocks()
}

const handleItemsPerPageChange = async (newPageSize) => {
  pagination.value.pageSize = newPageSize
  pagination.value.currentPage = 1
  await fetchStocks()
}

onMounted(() => {
  fetchStocks()
})
</script>

