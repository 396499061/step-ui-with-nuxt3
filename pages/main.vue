<script setup lang="ts">
import { ref, shallowRef } from 'vue'

// 引入步骤组件
import Step1 from '@/components/Step1.vue'
import Step2 from '@/components/Step2.vue'
import Step3 from '@/components/Step3.vue'
import Step4 from '@/components/Step4.vue'
import Step5 from '@/components/Step5.vue'
import Step6 from '@/components/Step6.vue'

// 当前步骤（1~6）
const step = ref(1)

// 步骤组件映射
const steps = shallowRef([Step1, Step2, Step3, Step4, Step5, Step6])

// 存储CSV的headers和data
const csvHeaders = ref([])
const csvData = ref([])

// 下一步
const nextStep = () => {
  if (step.value < 6) step.value++
}

// 上一步
const prevStep = () => {
  if (step.value > 1) step.value--
}

const stepLabels = ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6']

// 处理headers更新
const handleHeadersUpdated = (headers) => {
  csvHeaders.value = headers
}

// 处理数据更新
const handleDataUpdated = (data) => {
  csvData.value = data
}
</script>

<template>
  <v-app>
    <v-container>
      <!-- 主体内容 -->
      <v-container class="d-flex flex-column justify-center align-center flex-grow-1">
        <v-card elevation="2" class="px-8 py-10 rounded-xl"
          :style="{ width: '85vw', maxWidth: '85vw', minWidth: '300px', height: '85vh' }" color="indigo-lighten-5">
          <!-- 自定义 Stepper Header -->
          <div class="custom-stepper d-flex justify-space-between align-center mb-6">
            <template v-for="(label, index) in stepLabels" :key="index">
              <!-- 圆形步骤点 -->
              <div class="step-wrapper d-flex flex-column align-center">
                <div class="step-circle" :class="{
                  'done': step > index + 1,
                  'active': step === index + 1,
                  'pending': step < index + 1
                }">
                  {{ index + 1 }}
                </div>
                <div class="step-label" :class="{
                  'done': step > index + 1,
                  'active': step === index + 1,
                  'pending': step < index + 1
                }">
                  {{ label }}
                </div>
              </div>

              <!-- 线条，最后一个不显示 -->
              <div v-if="index < stepLabels.length - 1" class="step-line" :class="{
                'done': step > index + 1,
                'pending': step <= index + 1
              }"></div>
            </template>
          </div>

          <!-- 渲染当前步骤的组件 -->
          <div class="step-container">
            <component 
              :is="steps[step - 1]" 
              v-if="step === 1"
              @headers-updated="handleHeadersUpdated"
              @data-updated="handleDataUpdated"
              :initial-data="csvData"
            />
            <component 
              :is="steps[step - 1]" 
              v-else-if="step === 2"
              :headers="csvHeaders"
              :initial-data="csvData"
            />
            <component 
              :is="steps[step - 1]" 
              v-else
              :headers="csvHeaders"
              :initial-data="csvData"
            />
          </div>

          <!-- 按钮固定到底部 -->
          <v-row justify="space-between" class="mt-6">
            <v-btn v-if="step > 1" color="purple-darken-3" variant="elevated" @click="prevStep">
              ← Previous
            </v-btn>
            <v-spacer />
            <v-btn v-if="step < 6" color="purple-darken-3" variant="elevated" @click="nextStep">
              Next →
            </v-btn>
          </v-row>
        </v-card>
      </v-container>
    </v-container>
  </v-app>
</template>

<style scoped>
.step-container {
  width: 100%;
  max-width: 90vw;
  min-width: 300px;
  height: 89%;
  overflow-y: auto;
  margin: 0 auto;
}

/* 自定义滚动条样式 */
.step-container::-webkit-scrollbar {
  width: 8px;
}

.step-container::-webkit-scrollbar-track {
  background: transparent;
}

.step-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.step-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

.custom-stepper {
  position: relative;
  width: 100%;
}

.step-wrapper {
  position: relative;
  z-index: 2;
  width: 50px;
  text-align: center;
}

.step-circle {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: white !important;
  font-weight: bold;
  margin: 0 auto;
}

.step-label {
  margin-top: 8px;
  font-size: 0.8rem;
  color: #666;
  transition: all 0.3s ease;
}

.step-circle.done,
.step-label.done {
  color: white;
}

.step-circle.active,
.step-label.active {
  color: white;
}

.step-circle.pending,
.step-label.pending {
  color: #666;
}

.step-circle.done {
  background-color: #673ab7;
  color: white !important;
}

.step-circle.active {
  background-color: #ff9800;
  color: white !important;
}

.step-circle.pending {
  background-color: #bdbdbd;
  color: white !important;
}

.step-label.done {
  color: #673ab7;
  font-weight: 500;
}

.step-label.active {
  color: #ff9800;
  font-weight: 500;
}

.step-label.pending {
  color: #666;
}

.step-line {
  flex: 1;
  height: 3px;
  margin: 0 8px;
  background-color: #ccc;
  align-self: center;
  z-index: 1;
}

.step-line.done {
  background-color: #673ab7;
}

.step-line.pending {
  background-color: #ccc;
}

/* 响应式布局 */
@media (max-width: 1920px) {
  .step-container {
    max-width: 85vw;
  }
}

@media (max-width: 1366px) {
  .step-container {
    max-width: 80vw;
  }
}

@media (max-width: 1280px) {
  .step-container {
    max-width: 75vw;
  }
}
</style>