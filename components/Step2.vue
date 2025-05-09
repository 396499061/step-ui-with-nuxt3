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
      <div class="layout-container">
        <!-- 左侧列表 -->
        <div class="list-container">
          <h3>All Headers</h3>
          <v-list
            v-model:selected="selectedStep2Items"
            select-strategy="multiple"
            class="list-box"
          >
            <v-list-item
              v-for="header in allHeaders"
              :key="header"
              :value="header"
              :title="header"
              class="list-item"
            ></v-list-item>
          </v-list>
        </div>

        <!-- 右侧配置 -->
        <div class="config-container">
          <h3>Aggregation Settings</h3>
          <v-select
            v-model="selectedAggregation"
            :items="aggregationMethods"
            label="Aggregated By"
            variant="outlined"
          ></v-select>
        </div>
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
          :disabled="!selectedAggregation"
        >
          Next
        </v-btn>
      </div>
    </div>

    <!-- 步骤3：预览 -->
    <div v-if="currentStep === 3" class="step-content">
      <h3 class="text-h5 mb-4">Step 3: Time Settings</h3>
      <div class="config-container">
        <!-- 时间字段选择 -->
        <div class="setting-group">
          <h3>Time Field</h3>
          <v-select
            v-model="selectedTimeField"
            :items="allHeaders"
            label="Select Time Field"
            variant="outlined"
           
          ></v-select>
        </div>

        <!-- 时间间隔选择 -->
        <div class="setting-group">
          <h3>Time Interval</h3>
          <v-radio-group
            v-model="selectedTimeInterval"
            inline
          >
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <v-radio
              v-for="interval in timeIntervals"
              :key="interval.value"
              :label="interval.title"
              :value="interval.value"
            ></v-radio>
          </div>
            
          </v-radio-group>
        </div>

        <!-- 时区转换设置 -->
        <div class="setting-group">
          <h3>Time Zone Conversion</h3>
          <div class="timezone-container">
            <v-select
              v-model="sourceTimezone"
              :items="timezones"
              item-title="title"
              item-value="value"
              label="Source Timezone"
              variant="outlined"
            ></v-select>
            <v-icon class="timezone-arrow">mdi-arrow-right</v-icon>
            <v-select
              v-model="targetTimezone"
              :items="timezones"
              item-title="title"
              item-value="value"
              label="Target Timezone"
              variant="outlined"
            ></v-select>
          </div>
        </div>
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
          :disabled="!selectedTimeField || !selectedTimeInterval || !sourceTimezone || !targetTimezone"
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
const selectedAggregation = ref('')
const allHeaders = ref([])
const selectedStep2Items = ref([])

// 聚合方式选项（按字母顺序排序）
const aggregationMethods = [
  { title: 'Average', value: 'average' },
  { title: 'Count', value: 'count' },
  { title: 'Max', value: 'max' },
  { title: 'Sum', value: 'sum' }
]

// 步骤3相关状态
const selectedTimeField = ref('')
const selectedTimeInterval = ref('')
const sourceTimezone = ref('')
const targetTimezone = ref('')

// 时间间隔选项
const timeIntervals = [
  { title: 'By Hour', value: 'hour' },
  { title: 'By Day', value: 'day' },
  { title: 'By Week', value: 'week' },
  { title: 'By Month', value: 'month' }
]

// 时区列表
const timezones = [
  { title: '(UTC-12:00) International Date Line West', value: 'Etc/GMT+12' },
  { title: '(UTC-11:00) Coordinated Universal Time-11', value: 'Pacific/Pago_Pago' },
  { title: '(UTC-10:00) Hawaii', value: 'Pacific/Honolulu' },
  { title: '(UTC-09:00) Alaska', value: 'America/Anchorage' },
  { title: '(UTC-08:00) Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
  { title: '(UTC-07:00) Mountain Time (US & Canada)', value: 'America/Denver' },
  { title: '(UTC-06:00) Central Time (US & Canada)', value: 'America/Chicago' },
  { title: '(UTC-05:00) Eastern Time (US & Canada)', value: 'America/New_York' },
  { title: '(UTC-04:00) Atlantic Time (Canada)', value: 'America/Halifax' },
  { title: '(UTC-03:00) Brasilia', value: 'America/Sao_Paulo' },
  { title: '(UTC-02:00) Coordinated Universal Time-02', value: 'America/Noronha' },
  { title: '(UTC-01:00) Azores', value: 'Atlantic/Azores' },
  { title: '(UTC+00:00) Coordinated Universal Time', value: 'UTC' },
  { title: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna', value: 'Europe/Berlin' },
  { title: '(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius', value: 'Europe/Helsinki' },
  { title: '(UTC+03:00) Moscow, St. Petersburg', value: 'Europe/Moscow' },
  { title: '(UTC+04:00) Abu Dhabi, Muscat', value: 'Asia/Dubai' },
  { title: '(UTC+05:00) Tashkent', value: 'Asia/Tashkent' },
  { title: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi', value: 'Asia/Kolkata' },
  { title: '(UTC+06:00) Astana', value: 'Asia/Almaty' },
  { title: '(UTC+07:00) Bangkok, Hanoi, Jakarta', value: 'Asia/Bangkok' },
  { title: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi', value: 'Asia/Shanghai' },
  { title: '(UTC+09:00) Osaka, Sapporo, Tokyo', value: 'Asia/Tokyo' },
  { title: '(UTC+10:00) Canberra, Melbourne, Sydney', value: 'Australia/Sydney' },
  { title: '(UTC+11:00) Vladivostok', value: 'Asia/Vladivostok' },
  { title: '(UTC+12:00) Auckland, Wellington', value: 'Pacific/Auckland' },
  { title: '(UTC+13:00) Samoa', value: 'Pacific/Apia' },
  { title: '(UTC+14:00) Kiritimati Island', value: 'Pacific/Kiritimati' }
]

// 监听props变化，更新本地状态
watch(() => props.headers, (newHeaders) => {
  availableHeaders.value = [...newHeaders]
  allHeaders.value = [...newHeaders]
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

.config-container {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  flex-direction: column;
  gap: 20px;
}

.config-container h3 {
  margin: 0;
  text-align: center;
  color: var(--text-color);
  font-weight: 600;
}

.aggregation-select {
  width: 200px;
  margin: 0 auto;
}

.aggregation-select :deep(.v-field) {
  background-color: #f5f5f5;
  border-radius: 8px;
  min-height: 40px !important;
  height: 40px !important;
}

.aggregation-select :deep(.v-field__input) {
  padding: 8px 12px;
  font-size: 14px;
  min-height: 40px !important;
  height: 40px !important;
}

.aggregation-select :deep(.v-field__outline) {
  border-color: #ddd;
}

.aggregation-select :deep(.v-field:hover .v-field__outline) {
  border-color: var(--primary-color);
}

.preview-container {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-group {
  margin-bottom: 24px;
  width: 100%;
}

.setting-group h3 {
  margin: 0 0 20px 0;
  color: var(--text-color);
  font-weight: 500;
  text-align: center;
}

.setting-group h4 {
  margin: 0 0 12px 0;
  color: var(--text-color);
  font-weight: 500;
  text-align: center;
}

.time-select,
.timezone-select {
  width: 100%;
  /* max-width: 400px; */
  margin: 0 auto;
}

.time-select :deep(.v-field),
.timezone-select :deep(.v-field) {
  background-color: #f5f5f5;
  border-radius: 8px;
  min-height: 40px !important;
  height: 40px !important;
}

.time-select :deep(.v-field__input),
.timezone-select :deep(.v-field__input) {
  padding: 8px 12px;
  font-size: 14px;
  min-height: 40px !important;
  height: 40px !important;
  text-align: center;
}

.timezone-container {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  width: 100%;
}

.timezone-container .timezone-select {
  flex: 1;
  /* max-width: 300px; */
}

.timezone-arrow {
  color: var(--text-color);
  margin: 0 8px;
}

.time-interval-group {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
}

.time-interval-group :deep(.v-radio-group__input) {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.interval-radio {
  flex: 1;
  margin: 0 !important;
  padding: 0 !important;
  min-width: 0;
}

.interval-radio :deep(.v-selection-control) {
  width: 100%;
  justify-content: center;
  margin: 0;
}

.interval-radio :deep(.v-selection-control__wrapper) {
  width: 100%;
  display: flex;
  justify-content: center;
}

.interval-radio :deep(.v-label) {
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
  