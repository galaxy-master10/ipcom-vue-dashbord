<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        color="primary"
        variant="outlined"
        class="ml-4"
        prepend-icon="mdi-view-column"
      >
        Columns
      </v-btn>
    </template>

    <v-card min-width="300" class="column-manager">
      <v-card-title class="d-flex align-center pa-4">
        <span>Table Columns</span>
        <v-spacer></v-spacer>
        <v-btn
          density="compact"
          variant="text"
          @click="selectAll"
        >
          {{ allSelected ? 'Deselect All' : 'Select All' }}
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <!-- Group columns by category -->
        <div v-for="(group, category) in columnGroups" :key="category" class="mb-4">
          <div class="text-subtitle-1 mb-2">{{ category }}</div>
          <v-checkbox
            v-for="column in group"
            :key="column.key"
            v-model="selectedColumns"
            :value="column.key"
            :label="column.title"
            :disabled="isRequired(column.key)"
            hide-details
            density="compact"
            class="mb-1"
          ></v-checkbox>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Required columns that can't be hidden
const REQUIRED_COLUMNS = ['id']

const selectedColumns = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Group columns by category
const columnGroups = computed(() => {
  return props.columns.reduce((groups, column) => {
    const category = column.category || 'General'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(column)
    return groups
  }, {})
})

const allSelected = computed(() => {
  const selectableColumns = props.columns.filter(col => !REQUIRED_COLUMNS.includes(col.key))
  return selectableColumns.every(col => selectedColumns.value.includes(col.key))
})

const isRequired = (columnKey) => REQUIRED_COLUMNS.includes(columnKey)

const selectAll = () => {
  if (allSelected.value) {
    // Deselect all except required columns
    selectedColumns.value = [...REQUIRED_COLUMNS]
  } else {
    // Select all columns
    selectedColumns.value = props.columns.map(col => col.key)
  }
}
</script>

<style scoped>
.column-manager {
  max-height: 600px;
  overflow-y: auto;
}
</style>
