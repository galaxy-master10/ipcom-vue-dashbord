<!-- src/components/TableFilterSection.vue -->
<template>
  <div>
    <div>
      <v-btn
        color="primary"
        @click="toggleFilters"
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
        :available-columns="props.availableColumns"
        :model-value="props.filters"
        @update:model-value="handleFiltersUpdate"
      ></filter-panel>
    </v-expand-transition>
    <v-divider class="mb-4 mt-4"></v-divider>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FilterPanel from './FilterPanel.vue'

const props = defineProps({
  availableColumns: {
    type: Array,
    required: true,
    default: () => []
  },
  filters: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

const showFilters = ref(false)

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const handleFiltersUpdate = (newFilters) => {
  emit('update:filters', newFilters)
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 1rem;
}
</style>
