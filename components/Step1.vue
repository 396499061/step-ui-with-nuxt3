<template>
  <div class="step1-container" ref="container">
    <div v-if="!fileUploaded" class="upload-container">
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
    </div>

    <div v-else class="data-container">
      <div class="d-flex justify-end mb-4">
        <v-btn variant="outlined" prepend-icon="mdi-upload" @click="resetUpload" style="color: white;">
          Re-upload File
        </v-btn>
      </div>

      <!-- 统计信息 -->
      <v-card class="mb-4" color="indigo-lighten-5">
        <v-card-text>
          <div class="stats-container">
            <div class="stat-item">
              <div class="text-h8">Total Rows</div>
              <div class="text-h6">{{ stats.totalRows }}</div>
            </div>
            <div class="stat-item">
              <div class="text-h8">Total Columns</div>
              <div class="text-h6">{{ stats.totalColumns }}</div>
            </div>
            <div class="stat-item">
              <div class="text-h8">Headers</div>
              <div class="text-h6">{{ headers.join(', ') }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 数据表格 -->
      <!-- <div class="table-wrapper"> -->
        <v-data-table
          :headers="tableHeaders"
          :items="tableData"
          :items-per-page="50"
          fixed-header
          height="20vh"
        ></v-data-table>
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Papa from 'papaparse'

const props = defineProps({
  initialData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['headers-updated', 'data-updated'])

const fileInput = ref(null)
const isDragging = ref(false)
const fileUploaded = ref(false)
const parsedData = ref([])
const stats = ref({
  totalRows: 0,
  totalColumns: 0
})

const calculateStats = () => {
  if (!parsedData.value.length) return

  const headers = parsedData.value[0]
  const data = parsedData.value.slice(1)
  
  stats.value = {
    totalRows: data.length,
    totalColumns: headers.length
  }
}

const headers = computed(() => {
  if (!parsedData.value.length) return []
  return parsedData.value[0]
})

const tableHeaders = computed(() => {
  if (!parsedData.value.length) return []
  return parsedData.value[0].map(header => ({
    title: header,
    key: header,
    sortable: false,
    align: 'center'
  }))
})

const tableData = computed(() => {
  if (parsedData.value.length < 2) return []
  const headers = parsedData.value[0]
  return parsedData.value.slice(1).map(row => {
    const item = {}
    headers.forEach((header, index) => {
      item[header] = row[index]
    })
    return item
  })
})

const container = ref(null)

// 监听initialData变化
watch(() => props.initialData, (newData) => {
  if (newData && newData.length > 0) {
    parsedData.value = newData
    fileUploaded.value = true
    calculateStats()
  }
}, { immediate: true })

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
    complete: (results) => {
      parsedData.value = results.data
      calculateStats()
      fileUploaded.value = true
      emit('headers-updated', results.data[0])
      emit('data-updated', results.data)
    },
    header: false
  })
}

const resetUpload = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  fileUploaded.value = false
  parsedData.value = []
  stats.value = {
    totalRows: 0,
    totalColumns: 0
  }
  emit('headers-updated', [])
  emit('data-updated', [])
}
</script>

<style scoped>
.step1-container {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.upload-card {
  border: 2px dashed var(--primary-color);
  background-color: rgba(231, 76, 60, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  max-width: 600px;
  padding: 40px;
}

.upload-card--dragging {
  background-color: rgba(231, 76, 60, 0.1);
  border-color: var(--secondary-color);
  transform: scale(1.02);
}

.data-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.stat-item {
  text-align: center;
  min-width: 120px;
}

.headers-item {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.v-data-table {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

/* 表格样式 */
:deep(.v-data-table .v-data-table-header th) {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  text-align: center !important;
}

:deep(.v-data-table .v-data-table__td) {
  text-align: center !important;
}

/* 表格分页选项样式 */
:deep(.v-data-table-footer__items-per-page .v-list-item),
:deep(.v-data-table-footer__items-per-page .v-list-item:not(.v-list-item--active)),
:deep(.v-data-table-footer__items-per-page .v-list-item .v-list-item-title),
:deep(.v-data-table-footer__items-per-page .v-list-item:not(.v-list-item--active) .v-list-item-title),
:deep(.v-data-table-footer__items-per-page .v-menu__content .v-list-item),
:deep(.v-data-table-footer__items-per-page .v-menu__content .v-list-item:not(.v-list-item--active)),
:deep(.v-data-table-footer__items-per-page .v-menu__content .v-list-item .v-list-item-title),
:deep(.v-data-table-footer__items-per-page .v-menu__content .v-list-item:not(.v-list-item--active) .v-list-item-title) {
  color: rgba(0, 0, 0, 0.87) !important;
  opacity: 1 !important;
  font-weight: 500 !important;
}

:deep(.v-data-table-footer__items-per-page .v-field__input) {
  color: rgba(0, 0, 0, 0.87) !important;
  opacity: 1 !important;
}

</style>
  