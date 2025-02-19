<!-- src/views/ArticlePackagingBreakdownView.vue -->
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
        :items="filteredBreakdowns"
        :loading="loading"
        :items-length="pagination.totalItems"
        :page="pagination.currentPage"
        v-model:items-per-page="pagination.pageSize"
        @update:items-per-page="handleItemsPerPageChange"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Article Packaging Breakdowns ({{ pagination.totalItems }} total)</v-toolbar-title>
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
                :items="[5, 10, 15, 20, 25, 50,100]"
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
import { ArticlePackagingBreakdownService } from '../services/ArticlePackagingBreakdownService.js'

const breakdownService = new ArticlePackagingBreakdownService()

// State Management
const loading = ref(true)
const search = ref('')
const showFilters = ref(false)
const filters = ref([])
const breakdowns = ref([])
const error = ref(null)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
})

// Column Definitions
const allHeaders = [
  // Primary Information
  { title: 'ID', key: 'id', sortable: true, category: 'Primary' },
  { title: 'Article ID', key: 'articleId', sortable: true, category: 'Primary' },

  // From Unit Information
  { title: 'From Unit', key: 'fromUnit', sortable: true, category: 'From Unit' },
  { title: 'From Unit ID', key: 'fromUnitId', sortable: true, category: 'From Unit' },
  { title: 'From Factor', key: 'fromFactor', sortable: true, category: 'From Unit' },

  // To Unit Information
  { title: 'To Unit', key: 'toUnit', sortable: true, category: 'To Unit' },
  { title: 'To Unit ID', key: 'toUnitId', sortable: true, category: 'To Unit' },
  { title: 'To Factor', key: 'toFactor', sortable: true, category: 'To Unit' },

  // Additional Info
  { title: 'Cubes', key: 'cubes', sortable: true, category: 'Additional' },
  { title: 'Status In Use', key: 'statusInUse', sortable: true, category: 'Status' },
  { title: 'Is ERP', key: 'isERP', sortable: true, category: 'Status' },
  { title: 'Is Minimum Packaging', key: 'isMinimumPackaging', sortable: true, category: 'Status' }
]

const visibleColumnKeys = ref([
  'id',
  'articleId',
  'fromUnit',
  'toUnit',
  'cubes',
  'statusInUse',
  'isERP',
  'isMinimumPackaging'
])

const visibleHeaders = computed(() => {
  return allHeaders.filter(h => visibleColumnKeys.value.includes(h.key))
})

const filteredBreakdowns = computed(() => {
  if (!search.value) return breakdowns.value;

  const searchTerm = search.value.toLowerCase();
  return breakdowns.value.filter(breakdown => {
    return visibleHeaders.value.some(header => {
      const value = breakdown[header.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm);
    });
  });
});

const fetchBreakdowns = async () => {
  try {
    loading.value = true
    const filterParams = {
      ...filters.value.reduce((acc, filter) => ({
        ...acc,
        [filter.column]: filter.value
      }), {}),
      search: search.value
    }

    const response = await breakdownService.getArticlePackagingBreakdowns(
      filterParams,
      pagination.value.currentPage,
      pagination.value.pageSize
    )

    breakdowns.value = response.data
    pagination.value = {
      currentPage: response.pageNumber,
      pageSize: response.pageSize,
      totalItems: response.totalRecords,
      totalPages: response.totalPages
    }

    error.value = null
  } catch (err) {
    error.value = err.message
    breakdowns.value = []
  } finally {
    loading.value = false
  }
}

const handleFilters = async (newFilters) => {
  filters.value = [...newFilters]
  pagination.value.currentPage = 1
  await fetchBreakdowns()
}

const handlePageChange = async (newPage) => {
  pagination.value.currentPage = newPage
  await fetchBreakdowns()
}

const handleItemsPerPageChange = async (newPageSize) => {
  pagination.value.pageSize = newPageSize
  pagination.value.currentPage = 1
  await fetchBreakdowns()
}

onMounted(() => {
  fetchBreakdowns()
})
</script>

<style scoped>
.items-per-page-select :deep(.v-field__input) {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
