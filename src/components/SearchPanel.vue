<!-- src/components/SearchPanel.vue -->
<template>
  <div class="d-flex align-center">
    <v-text-field
      v-model="searchQuery"
      prepend-inner-icon="mdi-magnify"
      label="Search customers..."
      single-line
      variant="outlined"
      density="comfortable"
      hide-details
      class="flex-grow-1"
    ></v-text-field>

    <v-btn
      color="secondary"
      class="ml-2"
      @click="handleSearch"
    >
      Search
    </v-btn>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { debounce } from 'lodash';

const emit = defineEmits(['search']);
const searchQuery = ref('');

// Debounced search function
const debouncedSearch = debounce((value) => {
  emit('search', value);
}, 500);

// Handle search button click
const handleSearch = () => {
  debouncedSearch.cancel(); // Cancel any pending debounced searches
  emit('search', searchQuery.value);
};

// Clean up debounce on component unmount
onBeforeUnmount(() => {
  debouncedSearch.cancel();
});
</script>
