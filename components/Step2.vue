<template>
  <div class="layout-container">
    <!-- 步骤1：选择字段 -->
    <div v-if="currentStep === 1" class="step-content">
      <h3 class="text-h5 mb-4">Step 1: Select Fields</h3>
      <div class="layout-container">
        <!-- 左侧列表 -->
        <div class="list-container">
          <h3>Available Headers</h3>
          <v-list
            v-model:selected="selectedItems"
            select-strategy="multiple"
            class="list-box"
          >
            <v-list-item
              v-for="header in availableHeaders"
              :key="header"
              :value="header"
              :title="header"
              class="list-item"
            ></v-list-item>
          </v-list>
        </div>

        <!-- 中间按钮组 -->
        <div class="button-group">
          <v-btn
            color="primary"
            class="mb-2"
            @click="moveToTopRight"
            :disabled="!selectedItems.length"
          >
            Move to Top
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            class="mb-2"
            @click="moveToBottomRight"
            :disabled="!selectedItems.length"
          >
            Move to Bottom
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn
            color="secondary"
            @click="moveBackToLeft"
            :disabled="!selectedTopRightItems.length && !selectedBottomRightItems.length"
          >
            Move Back
            <v-icon end>mdi-arrow-left</v-icon>
          </v-btn>
        </div>

        <!-- 右侧容器 -->
        <div class="right-container">
          <!-- 右上列表 -->
          <div class="list-container">
            <h3>Top Selected Headers</h3>
            <v-list
              v-model:selected="selectedTopRightItems"
              select-strategy="multiple"
              class="list-box"
            >
              <v-list-item
                v-for="item in topRightItems"
                :key="item"
                :value="item"
                :title="item"
                class="list-item"
              ></v-list-item>
            </v-list>
          </div>

          <!-- 右下列表 -->
          <div class="list-container">
            <h3>Bottom Selected Headers</h3>
            <v-list
              v-model:selected="selectedBottomRightItems"
              select-strategy="multiple"
              class="list-box"
            >
              <v-list-item
                v-for="item in bottomRightItems"
                :key="item"
                :value="item"
                :title="item"
                class="list-item"
              ></v-list-item>
            </v-list>
          </div>
        </div>
      </div>
      <div class="step-actions mt-4">
        <v-btn
          color="primary"
          size="large"
          @click="confirmStep1"
          :disabled="!topRightItems.length && !bottomRightItems.length"
        >
          Confirm Selection
          <v-icon end>mdi-check</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- 步骤2：配置选项 -->
    <div v-if="currentStep === 2" class="step-content">
      <h3 class="text-h5 mb-4">Step 2: Configuration</h3>
      <div class="config-container">
        <!-- 这里添加配置选项 -->
        <p>Configuration options will be added here</p>
      </div>
      <div class="step-actions mt-4">
        <v-btn
          color="secondary"
          class="mr-2"
          @click="currentStep = 1"
        >
          Back
        </v-btn>
        <v-btn
          color="primary"
          @click="currentStep = 3"
        >
          Next
        </v-btn>
      </div>
    </div>

    <!-- 步骤3：预览 -->
    <div v-if="currentStep === 3" class="step-content">
      <h3 class="text-h5 mb-4">Step 3: Preview</h3>
      <div class="preview-container">
        <!-- 这里添加预览内容 -->
        <p>Preview will be shown here</p>
      </div>
      <div class="step-actions mt-4">
        <v-btn
          color="secondary"
          class="mr-2"
          @click="currentStep = 2"
        >
          Back
        </v-btn>
        <v-btn
          color="primary"
          @click="finishProcess"
        >
          Complete
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'

const props = defineProps({
  headers: {
    type: Array,
    required: true
  }
})

// 步骤控制
const currentStep = ref(1)

// 本地状态
const availableHeaders = ref([])
const selectedItems = ref([])
const selectedTopRightItems = ref([])
const selectedBottomRightItems = ref([])
const topRightItems = ref([])
const bottomRightItems = ref([])

// 监听props变化，更新本地状态
watch(() => props.headers, (newHeaders) => {
  availableHeaders.value = [...newHeaders]
}, { immediate: true })

const moveToTopRight = () => {
  topRightItems.value = [...new Set([...topRightItems.value, ...selectedItems.value])]
  availableHeaders.value = availableHeaders.value.filter(item => !selectedItems.value.includes(item))
  selectedItems.value = []
}

const moveToBottomRight = () => {
  bottomRightItems.value = [...new Set([...bottomRightItems.value, ...selectedItems.value])]
  availableHeaders.value = availableHeaders.value.filter(item => !selectedItems.value.includes(item))
  selectedItems.value = []
}

const moveBackToLeft = () => {
  const itemsToMove = [...selectedTopRightItems.value, ...selectedBottomRightItems.value]
  availableHeaders.value = [...new Set([...availableHeaders.value, ...itemsToMove])]
  topRightItems.value = topRightItems.value.filter(item => !selectedTopRightItems.value.includes(item))
  bottomRightItems.value = bottomRightItems.value.filter(item => !selectedBottomRightItems.value.includes(item))
  selectedTopRightItems.value = []
  selectedBottomRightItems.value = []
}

const confirmStep1 = () => {
  currentStep.value = 2
}

const finishProcess = () => {
  console.log('Process completed')
}
</script>

<style scoped>
.layout-container {
  display: flex;
  gap: 20px;
  height: calc((100vh - 120px) * 0.76);
  padding: 20px;
}

.step-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.step-content h3 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color);
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
  padding: 10px 0;
  z-index: 1;
}

.list-container {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.list-container h3 {
  margin: 0 0 10px 0;
  text-align: center;
  color: var(--text-color);
  font-weight: 600;
}

.list-box {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.list-item {
  color: var(--text-color) !important;
  font-weight: 500 !important;
  display: flex !important;
  justify-content: center !important;
  text-align: center !important;
  padding: 8px 16px !important;
}

.list-item:hover {
  background-color: rgba(231, 76, 60, 0.1) !important;
}

.v-list-item--active {
  background-color: rgba(231, 76, 60, 0.2) !important;
  color: var(--primary-color) !important;
}

.button-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-container,
.preview-container {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
  