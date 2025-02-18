<!-- src/views/CustomersView.vue -->
<template>
  <div>
    <!-- Search and Filter Section -->
    <div class="d-flex gap-4 mb-4">
      <search-panel
        @search="handleSearch"
        class="flex-grow-1"
      ></search-panel>

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

    <!-- Filter Panel -->
    <v-expand-transition>
      <filter-panel
        v-if="showFilters"
        @update:filters="handleFilters"
      ></filter-panel>
    </v-expand-transition>

    <!-- Error Message -->
    <v-alert
      v-if="error"
      type="error"
      class="mb-4"
    >
      {{ error }}
    </v-alert>

    <!-- Data Table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="customers"
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
            <v-btn color="primary" prepend-icon="mdi-plus">
              Add Customer
            </v-btn>
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
import { ref, onMounted } from 'vue'
import SearchPanel from '../components/SearchPanel.vue';
import FilterPanel from '../components/FilterPanel.vue';
import { CustomerService } from '../services/CustomerService.js'


const customerService = new CustomerService();


const loading = ref(true);
const search = ref('');
const showFilters = ref(false);
const filters = ref([]);
const customers = ref([]);
const error = ref(null);
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
});


const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'City', key: 'addressCity', sortable: true },
  { title: 'Country', key: 'addressCountry', sortable: true },
  { title: 'VAT Number', key: 'vatNumber', sortable: true },
  { title: 'Language', key: 'language', sortable: true },
  { title: 'Created', key: 'createdTS', sortable: true },
];

const fetchCustomers = async () => {
  try {
    loading.value = true;
    const filterParams = {
      ...filters.value.reduce((acc, filter) => ({
        ...acc,
        [filter.column]: filter.value
      }), {}),
      search: search.value
    };

    console.log('Fetching with params:', {
      filterParams,
      pageNumber: pagination.value.currentPage,
      pageSize: pagination.value.pageSize
    });

    const response = await customerService.getCustomers(
      filterParams,
      pagination.value.currentPage,
      pagination.value.pageSize
    );

    customers.value = response.data;
    pagination.value = {
      currentPage: response.pageNumber,
      pageSize: response.pageSize,
      totalItems: response.totalRecords,
      totalPages: response.totalPages
    };

    error.value = null;
  } catch (err) {
    error.value = err.message;
    customers.value = [];
  } finally {
    loading.value = false;
  }
};
const handleSearch = async (query) => {
  search.value = query;
  pagination.value.currentPage = 1;
  await fetchCustomers();
};

const handleFilters = async (newFilters) => {
  filters.value = newFilters;
  pagination.value.currentPage = 1;
  await fetchCustomers();
};

const handlePageChange = async (newPage) => {
  console.log('Changing to page:', newPage);
  pagination.value.currentPage = newPage;
  await fetchCustomers();
};
const handleItemsPerPageChange = async (newPageSize) => {
  pagination.value.pageSize = newPageSize;
  pagination.value.currentPage = 1;
  await fetchCustomers();
};





const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  fetchCustomers();
});
</script>

