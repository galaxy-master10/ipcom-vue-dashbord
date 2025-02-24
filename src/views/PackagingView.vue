<!-- src/views/ArticlePackagingBreakdownView.vue -->
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
      :items="breakdowns"
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
import { ArticlePackagingBreakdownService } from '../services/ArticlePackagingBreakdownService.js'
import BaseDataTable from '../components/BaseDataTable.vue'
import TableFilterSection from '../components/TableFilterSection.vue'

const breakdownService = new ArticlePackagingBreakdownService()
const title = 'Breakdown articles'
// State Management
const loading = ref(true)
const search = ref('')
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


