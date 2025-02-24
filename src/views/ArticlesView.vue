<!-- src/views/ArticlesView.vue -->
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
      :items="articles"
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
import { ArticleService } from '../services/ArticleService.js'
import BaseDataTable from '../components/BaseDataTable.vue'
import TableFilterSection from '../components/TableFilterSection.vue'

const articleService = new ArticleService()
const title = 'Articles'
// State Management
const loading = ref(true)
const search = ref('')
const filters = ref([])
const articles = ref([])
const error = ref(null)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
})


const allHeaders = [
  // Primary Information
  { title: 'ID', key: 'id', sortable: true, category: 'Primary' },
  { title: 'Article ID', key: 'articleId', sortable: true, category: 'Primary' },
  { title: 'Code', key: 'code', sortable: true, category: 'Primary' },
  { title: 'Product ID', key: 'productId', sortable: true, category: 'Primary' },
  { title: 'Index', key: 'index', sortable: true, category: 'Primary' },

  // Basic Info
  { title: 'Description', key: 'description', sortable: true, category: 'Basic Info' },
  { title: 'Application', key: 'application', sortable: true, category: 'Basic Info' },
  { title: 'Extra Info', key: 'extraInfo', sortable: true, category: 'Basic Info' },
  { title: 'Published', key: 'published', sortable: true, category: 'Basic Info' },

  // Product Info
  { title: 'Product', key: 'product', sortable: true, category: 'Product Info' },
  { title: 'Product Description', key: 'productDescription', sortable: true, category: 'Product Info' },
  { title: 'Product Group', key: 'productGroup', sortable: true, category: 'Product Info' },
  { title: 'Product Segmentation', key: 'productSegmentation', sortable: true, category: 'Product Info' },
  { title: 'Product Type', key: 'productType', sortable: true, category: 'Product Info' },
  { title: 'Competence Center', key: 'competenceCenter', sortable: true, category: 'Product Info' },

  // Units
  { title: 'Pricing Unit', key: 'pricingUnit', sortable: true, category: 'Units' },
  { title: 'Pricing Unit ID', key: 'pricingUnitId', sortable: true, category: 'Units' },
  { title: 'Packaging Unit', key: 'packagingUnit', sortable: true, category: 'Units' },
  { title: 'Packaging Unit ID', key: 'packagingUnitId', sortable: true, category: 'Units' },

  // Measurements
  { title: 'Diameter', key: 'diameter', sortable: true, category: 'Measurements' },
  { title: 'Diameter Unit', key: 'diameterUnit', sortable: true, category: 'Measurements' },
  { title: 'Length', key: 'length', sortable: true, category: 'Measurements' },
  { title: 'Length Unit', key: 'lengthUnit', sortable: true, category: 'Measurements' },
  { title: 'Thickness', key: 'thickness', sortable: true, category: 'Measurements' },
  { title: 'Thickness Unit', key: 'thicknessUnit', sortable: true, category: 'Measurements' },
  { title: 'Width', key: 'width', sortable: true, category: 'Measurements' },
  { title: 'Width Unit', key: 'widthUnit', sortable: true, category: 'Measurements' },
  { title: 'Volume', key: 'volume', sortable: true, category: 'Measurements' },
  { title: 'Volume Unit', key: 'volumeUnit', sortable: true, category: 'Measurements' },
  { title: 'Weight', key: 'weight', sortable: true, category: 'Measurements' },
  { title: 'Weight Unit', key: 'weightUnit', sortable: true, category: 'Measurements' },
  { title: 'R', key: 'r', sortable: true, category: 'Measurements' },
  { title: 'R Unit', key: 'rUnit', sortable: true, category: 'Measurements' },

  // Properties
  { title: 'Sector', key: 'sector', sortable: true, category: 'Properties' },
  { title: 'Brand', key: 'brand', sortable: true, category: 'Properties' },
  { title: 'Material', key: 'material', sortable: true, category: 'Properties' },
  { title: 'Type', key: 'type', sortable: true, category: 'Properties' },
  { title: 'Finish', key: 'finish', sortable: true, category: 'Properties' },
  { title: 'Color', key: 'color', sortable: true, category: 'Properties' },
  { title: 'Fire Class', key: 'fireClass', sortable: true, category: 'Properties' },
  { title: 'Edge Finish', key: 'edgeFinish', sortable: true, category: 'Properties' },
  { title: 'Coating', key: 'coating', sortable: true, category: 'Properties' }
]
const visibleColumnKeys = ref([
  'id',
  'articleId',
  'code',
  'description',
  'product',
  'productGroup',
  'sector',
  'brand',
  'published'
])

const visibleHeaders = computed(() => {
  return allHeaders.filter(h => visibleColumnKeys.value.includes(h.key))
})

const fetchArticles = async () => {
  try {
    loading.value = true
    const filterParams = {
      ...filters.value.reduce((acc, filter) => ({
        ...acc,
        [filter.column]: filter.value
      }), {}),
      search: search.value
    }

    const response = await articleService.getArticles(
      filterParams,
      pagination.value.currentPage,
      pagination.value.pageSize
    )

    articles.value = response.data
    pagination.value = {
      currentPage: response.pageNumber,
      pageSize: response.pageSize,
      totalItems: response.totalRecords,
      totalPages: response.totalPages
    }

    error.value = null
  } catch (err) {
    error.value = err.message
    articles.value = []
  } finally {
    loading.value = false
  }
}
const handleFilters = async (newFilters) => {
  filters.value = [...newFilters]
  pagination.value.currentPage = 1
  await fetchArticles()
}

const handlePageChange = async (newPage) => {
  pagination.value.currentPage = newPage
  await fetchArticles()
}

const handleItemsPerPageChange = async (newPageSize) => {
  pagination.value.pageSize = newPageSize
  pagination.value.currentPage = 1
  await fetchArticles()
}

onMounted(() => {
  fetchArticles()
})
</script>


