<!-- src/components/BaseDataTable.vue -->
<template>
  <v-card>
    <v-data-table
      :headers="computedVisibleHeaders"
      :items="items"
      :loading="loading"
      :server-items-length="props.pagination.totalItems"
      :page="props.pagination.currentPage"
      :items-per-page="props.pagination.pageSize"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ title }} ({{ props.pagination.totalItems }} total)</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <div class="text-caption">
            Page {{ props.pagination.currentPage }} of {{ props.pagination.totalPages }}
          </div>
          <v-spacer></v-spacer>

          <column-manager
            :model-value="props.visibleColumnKeys"
            @update:model-value="handleColumnUpdate"
            :columns="props.allHeaders"
          />
        </v-toolbar>
      </template>

      <template v-slot:no-data>
        {{ loading ? 'Loading...' : 'No data available' }}
      </template>

      <template v-slot:bottom>
        <div>
          <TablePagination
            :page="props.pagination.currentPage"
            :page-size="props.pagination.pageSize"
            :total-pages="props.pagination.totalPages"
            @update:page="handlePageChange"
            @update:page-size="handleItemsPerPageChange"
          />
        </div>


      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import ColumnManager from './ColumnManager.vue'
import { computed } from 'vue'
import TablePagination from '../components/TablePagination.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  },
  visibleHeaders: {
    type: Array,
    required: true
  },
  allHeaders: {
    type: Array,
    required: true
  },
  visibleColumnKeys: {
    type: Array,
    required: true
  }
})
const computedVisibleHeaders = computed(() => {
  return props.allHeaders.filter(header => props.visibleColumnKeys.includes(header.key));
});
const emit = defineEmits(['update:page', 'update:pageSize', 'update:visibleColumnKeys'])

const handleItemsPerPageChange = (newSize) => {
  emit('update:pageSize', newSize)
}

const handlePageChange = (newPage) => {
  console.log('newPage', newPage)
  emit('update:page', newPage)
}

const handleColumnUpdate = (newColumns) => {
  emit('update:visibleColumnKeys', newColumns)
}
</script>

<style scoped>
.items-per-page-select :deep(.v-field__input) {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
