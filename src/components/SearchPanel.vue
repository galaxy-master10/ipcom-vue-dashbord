<!-- src/components/SearchPanel.vue -->
<template>
  <v-text-field
    v-model="searchQuery"
    prepend-inner-icon="mdi-magnify"
    label="Search customers..."
    single-line
    variant="outlined"
    density="comfortable"
    hide-details
    class="mb-4"
    @update:model-value="handleSearch"
  ></v-text-field>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search']);
const searchQuery = ref('');

const handleSearch = (value) => {
  emit('search', value);
};
</script>
