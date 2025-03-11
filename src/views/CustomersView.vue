
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
      :items="customers"
      :loading="loading"
      :pagination="pagination"
      :visible-headers="visibleHeaders"
      :all-headers="allHeaders"
      v-model:visibleColumnKeys="visibleColumnKeys"
      @update:page="handlePageChange"
      @update:pageSize="handleItemsPerPageChange"
      @click:row="handleRowClick"
      ></BaseDataTable>
    <DetailModal
      v-model="showModal"
      :item-id="selectedItemId"
      :fetch-details="fetchItemDetails"
      :title="'Customer Details'"
      :all-headers="allHeaders"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { CustomerService } from '../services/CustomerService.js'
import TableFilterSection from '@/components/TableFilterSection.vue'
import BaseDataTable from '@/components/BaseDataTable.vue'
import DetailModal from '@/components/DetailModal.vue'

const customerService = new CustomerService()


const loading = ref(true)
const search = ref('')
const filters = ref([])
const customers = ref([])
const error = ref(null)
const showModal = ref(false)
const selectedItemId = ref(null)
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

const title = "Customers"

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


const fetchItemDetails = async (id) => {
  return await customerService.getCustomerById(id)
}
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



const handleRowClick = (row) => {
  if (row && row.id) {
    selectedItemId.value = row.id;
    showModal.value = true;
  } else {
    console.error('Invalid row data:', row);
  }
}
const handleFilters = async (newFilters) => {
  filters.value = [...newFilters];
  pagination.value.currentPage = 1
  await fetchCustomers()
}

const handlePageChange = async (newPage) => {
  pagination.value.currentPage = newPage
  await fetchCustomers()
}

const handleItemsPerPageChange = async (newPageSize) => {
  pagination.value.pageSize = newPageSize
  pagination.value.currentPage = 1
  await fetchCustomers()
}

onMounted(() => {
  fetchCustomers()
})
</script>
