<template>
  <div>
    <h2>CSV File Upload and Analysis</h2>
    
    <!-- 拖拽上传组件 -->
    <v-card
      class="upload-card"
      :class="{ 'upload-card--dragging': isDragging }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <v-card-text class="text-center">
        <v-icon
          size="64"
          color="primary"
          class="mb-4"
        >
          mdi-cloud-upload
        </v-icon>
        <h3 class="text-h6 mb-2">Drag and drop your CSV file here</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          or
        </p>
        <v-btn
          color="primary"
          @click="triggerFileInput"
        >
          Browse Files
        </v-btn>
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          class="d-none"
          @change="handleFileInput"
        >
      </v-card-text>
    </v-card>

    <!-- Statistics -->
    <v-card v-if="tableData.length > 0" class="mb-4">
      <v-card-text>
        <h3>Statistics</h3>
        <p>Number of Headers: {{ headers.length }}</p>
        <p>Number of Rows: {{ tableData.length }}</p>
        <p>Headers: {{ headers.join(', ') }}</p>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-data-table
      v-if="tableData.length > 0"
      :headers="tableHeaders"
      :items="tableData"
      :items-per-page="10"
      class="elevation-1 fixed-height-table"
      fixed-header
      height="600px"
    ></v-data-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Papa from 'papaparse'

const emit = defineEmits(['headers-updated'])

const fileInput = ref(null)
const isDragging = ref(false)
const headers = ref([])
const tableData = ref([])
const tableHeaders = ref([])

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'text/csv') {
    parseCSV(file)
  }
}

const handleFileInput = (event) => {
  const file = event.target.files[0]
  if (file) {
    parseCSV(file)
  }
}

const parseCSV = (file) => {
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      if (results.data.length > 0) {
        // Get headers
        headers.value = Object.keys(results.data[0])
        
        // Prepare table headers
        tableHeaders.value = headers.value.map(header => ({
          title: header,
          key: header,
          sortable: true
        }))
        
        // Set table data
        tableData.value = results.data

        // Emit headers to parent component
        emit('headers-updated', headers.value)
      }
    }
  })
}
</script>

<style scoped>
.upload-card {
  border: 2px dashed var(--primary-color);
  background-color: rgba(231, 76, 60, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 24px;
}

.upload-card--dragging {
  background-color: rgba(231, 76, 60, 0.1);
  border-color: var(--secondary-color);
  transform: scale(1.02);
}

.fixed-height-table {
  height: 600px;
  overflow-y: auto;
}

.fixed-height-table :deep(.v-data-table__wrapper) {
  height: 600px;
  overflow-y: auto;
}

.fixed-height-table :deep(.v-data-table__wrapper table) {
  position: relative;
}

.fixed-height-table :deep(.v-data-table__wrapper thead) {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}
</style>
  