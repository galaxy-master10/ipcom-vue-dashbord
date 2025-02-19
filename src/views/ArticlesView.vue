<!-- src/views/ArticlesView.vue -->
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
        :items="filteredArticles"
        :loading="loading"
        :items-length="pagination.totalItems"
       :page="pagination.currentPage"
        v-model:items-per-page="pagination.pageSize"
        @update:items-per-page="handleItemsPerPageChange"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Articles ({{ pagination.totalItems }} total)</v-toolbar-title>
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
import { ArticleService } from '../services/ArticleService.js'

const articleService = new ArticleService()

// State Management
const loading = ref(true)
const search = ref('')
const showFilters = ref(false)
const filters = ref([])
const articles = ref([])
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

const filteredArticles = computed(() => {
  if (!search.value) return articles.value;

  const searchTerm = search.value.toLowerCase();
  return articles.value.filter(article => {
    return visibleHeaders.value.some(header => {
      const value = article[header.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm);
    });
  });
});

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

<style scoped>
.items-per-page-select :deep(.v-field__input) {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
