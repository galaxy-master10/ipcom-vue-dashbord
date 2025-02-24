<!-- src/components/BaseDataView.vue -->
<template>
  <div>
    <TableFilterSection
      :available-columns="visibleHeaders"
      v-model:filters="filters"
      @update:filters="handleFilters"
    />

    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <BaseDataTable
      :title="title"
      :items="filteredItems"
      :loading="loading"
      :pagination="pagination"
      :visible-headers="visibleHeaders"
      :all-headers="allHeaders"
      v-model:visibleColumnKeys="visibleColumnKeys"
      @update:page="handlePageChange"
      @update:pageSize="handleItemsPerPageChange"
    >
      <template #item-slots>
        <slot name="item-slots"></slot>
      </template>
    </BaseDataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TableFilterSection from './TableFilterSection.vue'
import BaseDataTable from './BaseDataTable.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  service: {
    type: Object,
    required: true
  },
  allHeaders: {
    type: Array,
    required: true
  },
  defaultVisibleColumns: {
    type: Array,
    required: true
  }
})

// State Management
const loading = ref(true)
const search = ref('')
const filters = ref([])
const items = ref([])
const error = ref(null)
const visibleColumnKeys = ref(props.defaultVisibleColumns)

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
})

const visibleHeaders = computed(() => {
  return props.allHeaders.filter(h => visibleColumnKeys.value.includes(h.key))
})

const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter(item => {
    return visibleHeaders.value.some(header => {
      const value = item[header.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm);
    });
  });
})

const fetchItems = async () => {
  try {
    loading.value = true
    const filterParams = {
      ...filters.value.reduce((acc, filter) => ({
        ...acc,
        [filter.column]: filter.value
      }), {}),
      search: search.value
    }

    const response = await props.service.getCustomers(
      filterParams,
      pagination.value.currentPage,
      pagination.value.pageSize
    )

    items.value = response.data
    pagination.value = {
      currentPage: response.pageNumber,
      pageSize: response.pageSize,
      totalItems: response.totalRecords,
      totalPages: response.totalPages
    }

    error.value = null
  } catch (err) {
    error.value = err.message
    items.value = []
  } finally {
    loading.value = false
  }
}

const handleFilters = async (newFilters) => {
  filters.value = [...newFilters]
  pagination.value.currentPage = 1
  await fetchItems()
}

const handlePageChange = async (newPage) => {
  pagination.value.currentPage = newPage
  await fetchItems()
}

const handleItemsPerPageChange = async (newPageSize) => {
  pagination.value.pageSize = newPageSize
  pagination.value.currentPage = 1
  await fetchItems()
}

onMounted(() => {
  fetchItems()
})
</script>
