
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
        :available-columns="filterableColumns"
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
        :items="filteredCustomers"
        :loading="loading"
        :items-length="pagination.totalItems"
        :page="pagination.currentPage"
        v-model:items-per-page="pagination.pageSize"
        @update:items-per-page="handleItemsPerPageChange"
      >

        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Customers ({{ pagination.totalItems }} total)</v-toolbar-title>
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

        <template v-slot:[`item.createdTS`]="{ item }">
          {{ formatDate(item.createdTS) }}
        </template>

        <template v-slot:no-data>
          {{ loading ? 'Loading...' : 'No data available' }}
        </template>

        <template v-slot:bottom>
          <div class="text-center pt-2">
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
import { CustomerService } from '../services/CustomerService.js'

const customerService = new CustomerService()

// State Management
const loading = ref(true)
const search = ref('')
const showFilters = ref(false)
const filters = ref([])
const customers = ref([])
const error = ref(null)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
})

const allHeaders = [
  { title: 'ID', key: 'id', sortable: true, category: 'Primary' },
  { title: 'Customer ID', key: 'customerId', sortable: true, category: 'Primary' },
  { title: 'Contact ID', key: 'customerContactId', sortable: true, category: 'Primary' },
  { title: 'Source', key: 'sourceId', sortable: false, category: 'Primary' },
  { title: 'Customer Name', key: 'customerName', sortable: true, category: 'Basic Info' },
  { title: 'First Name', key: 'firstName', sortable: true, category: 'Basic Info' },
  { title: 'Name', key: 'name', sortable: true, category: 'Basic Info' },
  { title: 'Email', key: 'email', sortable: true, category: 'Contact' },
  { title: 'Mobile', key: 'mobile', sortable: false, category: 'Contact' },
  { title: 'Web', key: 'web', sortable: false, category: 'Contact' },
  { title: 'Street', key: 'addressStreet', sortable: false, category: 'Address' },
  { title: 'Number', key: 'addressNumber', sortable: false, category: 'Address' },
  { title: 'Postal Code', key: 'addressPostalCode', sortable: false, category: 'Address' },
  { title: 'City', key: 'addressCity', sortable: true, category: 'Address' },
  { title: 'Country', key: 'addressCountry', sortable: true, category: 'Address' },
  { title: 'VAT Number', key: 'vatNumber', sortable: true, category: 'Additional' },
  { title: 'Language', key: 'language', sortable: true, category: 'Additional' },
  { title: 'Created', key: 'createdTS', sortable: true, category: 'Additional' }
]


const visibleColumnKeys = ref([
  'id',
  'name',
  'email',
  'addressCity',
  'addressCountry',
  'vatNumber',
  'language',
  'createdTS'
])

const visibleHeaders = computed(() => {
  return allHeaders.filter(h => visibleColumnKeys.value.includes(h.key))
})


const filterableColumns = computed(() => {
  return allHeaders
    .filter(header => header.sortable && visibleColumnKeys.value.includes(header.key))
    .map(header => ({
      title: header.title,
      key: header.key
    }))
})

const fetchCustomers = async () => {
  try {
    loading.value = true
    const filterParams = {
      ...filters.value.reduce((acc, filter) => ({
        ...acc,
        [filter.column]: filter.value
      }), {}),
      search: search.value
    }

    console.log('Fetching with params:', {
      filterParams,
      pageNumber: pagination.value.currentPage,
      pageSize: pagination.value.pageSize
    })

    const response = await customerService.getCustomers(
      filterParams,
      pagination.value.currentPage,
      pagination.value.pageSize
    )

    customers.value = response.data
    pagination.value = {
      currentPage: response.pageNumber,
      pageSize: response.pageSize,
      totalItems: response.totalRecords,
      totalPages: response.totalPages
    }

    error.value = null
  } catch (err) {
    error.value = err.message
    customers.value = []
  } finally {
    loading.value = false
  }
}

const filteredCustomers = computed(() => {
  if (!search.value) return customers.value;

  const searchTerm = search.value.toLowerCase();
  return customers.value.filter(customer => {
    return visibleHeaders.value.some(header => {
      const value = customer[header.key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm);
    });
  });
});

const handleSearch = async (query) => {
  search.value = query || '';
  pagination.value.currentPage = 1;
  await fetchCustomers();
};

const handleFilters = async (newFilters) => {
  filters.value = [...newFilters];
  pagination.value.currentPage = 1
  await fetchCustomers()
}

const handlePageChange = async (newPage) => {
  console.log('Changing to page:', newPage)
  pagination.value.currentPage = newPage
  await fetchCustomers()
}

const handleItemsPerPageChange = async (newPageSize) => {
  pagination.value.pageSize = newPageSize
  pagination.value.currentPage = 1
  await fetchCustomers()
}


const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}


onMounted(() => {
  fetchCustomers()
})
</script>
