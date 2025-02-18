<!-- src/components/FilterPanel.vue -->
<template>
  <v-card class="mb-4" flat>
    <v-card-text>
      <!-- Active Filters -->
      <div class="d-flex flex-wrap gap-2 mb-4" v-if="activeFilters.length">
        <v-chip
          v-for="(filter, index) in activeFilters"
          :key="index"
          closable
          class="ma-1"
          @click:close="removeFilter(index)"
        >
          {{ getColumnTitle(filter.column) }}: {{ filter.value }}
        </v-chip>
      </div>

      <!-- Filter Controls -->
      <div class="d-flex flex-wrap align-center gap-2">
        <v-select
          v-model="selectedColumn"
          :items="availableColumns"
          item-title="title"
          item-value="key"
          label="Select column"
          variant="outlined"
          density="comfortable"
          hide-details
          class="flex-grow-0"
          style="min-width: 200px;"
        ></v-select>

        <v-text-field
          v-model="filterValue"
          label="Filter value"
          variant="outlined"
          density="comfortable"
          hide-details
          class="flex-grow-1"
          @keyup.enter="addFilter"
        ></v-text-field>

        <v-btn
          color="primary"
          @click="addFilter"
          :disabled="!canAddFilter"
        >
          Add Filter
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  availableColumns: {
    type: Array,
    required: true,
    default: () => [],
    validator: (value) => {
      return value.every(item => 'key' in item && 'title' in item);
    }
  }
});

const emit = defineEmits(['update:filters']);

const selectedColumn = ref(null);
const filterValue = ref('');
const activeFilters = ref([]);

const canAddFilter = computed(() =>
  selectedColumn.value && filterValue.value.trim()
);

const getColumnTitle = (columnKey) => {
  const column = props.availableColumns.find(col => col.key === columnKey);
  return column ? column.title : columnKey;
};

const addFilter = () => {
  if (canAddFilter.value) {
    activeFilters.value.push({
      column: selectedColumn.value,
      value: filterValue.value.trim()
    });
    emit('update:filters', activeFilters.value);

    filterValue.value = '';
    selectedColumn.value = null;
  }
};

const removeFilter = (index) => {
  activeFilters.value.splice(index, 1);
  emit('update:filters', activeFilters.value);
};
</script>
