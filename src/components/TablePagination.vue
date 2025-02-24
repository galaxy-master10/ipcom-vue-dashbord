<!-- src/components/TablePagination.vue -->
<template>
  <div class="d-flex align-center justify-space-between px-4">
    <div class="d-flex align-center">
      <span class="mr-2">Rows per page:</span>
      <v-select
        :model-value="props.pageSize"
        :items="[5, 10, 15, 20, 25, 50, 100]"
        variant="outlined"
        density="compact"
        hide-details
        class="items-per-page-select"
        style="width: 90px"
        @update:model-value="handlePageSizeChange"
      ></v-select>
    </div>

    <v-pagination
      :model-value="props.page"
      :length="props.totalPages"
      :total-visible="7"
      @update:model-value="handlePageChange"
    ></v-pagination>
  </div>
</template>

<script setup>
const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:page', 'update:pageSize'])

const handlePageChange = (newPage) => {
  emit('update:page', newPage)
}

const handlePageSizeChange = (newSize) => {
  emit('update:pageSize', newSize)
}
</script>

<style scoped>
.items-per-page-select :deep(.v-field__input) {
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
