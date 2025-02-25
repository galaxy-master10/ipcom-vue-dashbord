<!-- DetailModal.vue -->
<template>
  <v-dialog v-model="isOpen" max-width="800px">
    <v-card>
      <v-card-title class="text-h5 d-flex justify-space-between align-center">
        {{ title }}
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-container v-if="loading">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-container>

        <v-container v-else-if="error">
          <v-alert type="error">{{ error }}</v-alert>
        </v-container>

        <v-container v-else-if="detailData">
          <v-form>
            <template v-for="category in groupedHeaders" :key="category.name">
              <v-card-subtitle class="font-weight-bold pt-4">
                {{ category.name }}
              </v-card-subtitle>

              <v-row>
                <v-col
                  v-for="header in category.headers"
                  :key="header.key"
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="detailData[header.key]"
                    :label="header.title"
                    :readonly="true"
                    density="comfortable"
                    variant="outlined"
                    hide-details="auto"
                    class="mb-2"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="close"
          variant="tonal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { groupBy } from 'lodash'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Details'
  },
  fetchDetails: {
    type: Function,
    required: true
  },
  itemId: {
    type: [String, Number, Object],
    default: null
  },
  allHeaders: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const error = ref(null)
const detailData = ref(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})


const groupedHeaders = computed(() => {
  const grouped = groupBy(props.allHeaders, 'category')
  return Object.entries(grouped).map(([name, headers]) => ({
    name,
    headers
  }))
})

const fetchData = async () => {
  if (!props.itemId) return

  try {
    loading.value = true
    error.value = null
    detailData.value = await props.fetchDetails(props.itemId)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const close = () => {
  isOpen.value = false
  detailData.value = null
  error.value = null
}

watch(() => props.itemId, (newId) => {
  if (newId && isOpen.value) {
    fetchData()
  }
})

watch(isOpen, (newValue) => {
  if (newValue && props.itemId) {
    fetchData()
  }
})
</script>
