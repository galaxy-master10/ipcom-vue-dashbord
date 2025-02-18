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
          {{ filter.column }}: {{ filter.value }}
        </v-chip>
      </div>

      <!-- Filter Controls -->
      <div class="d-flex flex-wrap align-center gap-2">
        <v-select
          v-model="selectedColumn"
          :items="columns"
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

const emit = defineEmits(['update:filters']);

const columns = [
  { title: 'Customer ID', value: 'CustomerId' },
  { title: 'Name', value: 'CustomerName' },
  { title: 'Email', value: 'Email' },
  { title: 'City', value: 'AddressCity' },
  { title: 'Country', value: 'AddressCountry' },
  { title: 'VAT Number', value: 'VatNumber' },
  { title: 'Language', value: 'Language' },
  { title: 'Created Date', value: 'CreatedTS' }
];

const selectedColumn = ref(null);
const filterValue = ref('');
const activeFilters = ref([]);

const canAddFilter = computed(() =>
  selectedColumn.value && filterValue.value.trim()
);

const addFilter = () => {
  if (canAddFilter.value) {
    activeFilters.value.push({
      column: selectedColumn.value,
      value: filterValue.value.trim()
    });
    emit('update:filters', activeFilters.value);
    // Reset inputs
    filterValue.value = '';
    selectedColumn.value = null;
  }
};

const removeFilter = (index) => {
  activeFilters.value.splice(index, 1);
  emit('update:filters', activeFilters.value);
};
</script>
