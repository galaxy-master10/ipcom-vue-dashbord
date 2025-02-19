<!-- src/views/ArticleXAvailableStockView.vue -->
<template>
  <div>
    <div>
      <v-btn
        color="primary"
        @click="showFilters = !showFilters"
        variant="outlined"
      >
        <v-icon start>
          {{ showFilters ? 'mdi-filter-off' : 'mdi-filter' }}
        </v-icon>
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </v-btn>
    </div>

    <v-expand-transition>
      <filter-panel
        v-if="showFilters"
        @update:filters="handleFilters"
        :available-columns="visibleHeaders"
        v-model="filters"
      ></filter-panel>
    </v-expand-transition>
    <v-divider class="mb-4 mt-4"></v-divider>

    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <v-card>
      <v-data-table
        :headers="visibleHeaders"
        :items="filteredStocks"
        :loading="loading"
        :items-length="pagination.totalItems"
        :page="pagination.currentPage"
        v-model:items-per-page="pagination.pageSize"
        @update:items-per-page="handleItemsPerPageChange"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Available Stocks ({{ pagination.totalItems }} total)</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-spacer></v-spacer>
            <div class="text-caption">
              Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
            </div>
            <v-spacer></v-spacer>

            <column-manager
              v-model="visibleColumnKeys"
              :columns="allHeaders"
            />
          </v-toolbar>
        </template>

        <template v-slot:no-data>
          {{ loading ? 'Loading...' : 'No data available' }}
        </template>

        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between px-4">
            <div class="d-flex align-center">
              <span class="mr-2">Rows per page:</span>
              <v-select
                v-model="pagination.pageSize"
                :items="[5, 10, 15, 20, 25, 50]"
                variant="outlined"
                density="compact"
                hide-details
                class="items-per-page-select"
                style="width: 90px"
                @update:model-value="handleItemsPerPageChange"
              ></v-select>
            </div>

            <v-pagination
              v-model="pagination.currentPage"
              :length="pagination.totalPages"
              :total-visible="7"
              @update:model-value="handlePageChange"
            ></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FilterPanel from '../components/FilterPanel.vue'
import ColumnManager from '../components/ColumnManager.vue'
import { ArticleXAvailableStockService } from '../services/ArticleXAvailableStockService.js'

const stockService = new ArticleXAvailableStockService()

// State Management
const loading = ref(true)
const search = ref('')
const showFilters = ref(false)
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

const filteredStocks = computed(() => {
  if (!search.value) return stocks.value;

  const searchTerm = search.value.toLowerCase();
  return stocks.value.filter(stock => {
    return visibleHeaders.value.some(header => {
      const value = stock[header.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm);
    });
  });
});

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

<style scoped>
.items-per-page-select :deep(.v-field__input) {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
