<script setup>

import { CustomerService } from '../services/CustomerService.js'
import { onMounted, ref } from 'vue'
import BaseDataTable from '../components/BaseDataTable.vue'
import TableFilterSection from '@/components/TableFilterSection.vue'
import TablePagination from '@/components/TablePagination.vue'
const customers = ref([])
const loading = ref(true)
const search = ref('')
const filters = ref([])
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
const visibleHeaders  = allHeaders.filter(h => visibleColumnKeys.value.includes(h.key))

const customerService = new CustomerService()
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
const title = 'Customers'
</script>

<template>
  <div>
    <TableFilterSection
      :available-columns="visibleHeaders"
      v-model:filters="filters"
      @update:filters="handleFilters"
    />
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
    ></BaseDataTable>

  </div>

</template>

<style scoped>

</style>
