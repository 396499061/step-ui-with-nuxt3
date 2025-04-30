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

// 存储CSV的headers
const csvHeaders = ref([])

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
</script>

<template>
  <v-app>
    <v-container>


      <!-- 主体内容 -->
      <v-container class="d-flex flex-column justify-center align-center flex-grow-1">
        <v-card elevation="2" class="px-8 py-10 rounded-xl"
          :style="{ width: '85vw', maxWidth: '85vw', minWidth: '300px', height: '85vh' }" color="indigo-lighten-5">
          <!-- 步骤指示器 (固定顶部) -->
          <!-- <v-stepper v-model="step" alt-labels class="rounded-0 stepper-transparent no-border"
            color="deep-purple-accent-4">
            <v-stepper-header class="stepper-transparent">
              <v-stepper-item v-for="n in 6" :key="n" :value="n" :title="`Step ${n}`" color="purple" />
            </v-stepper-header>
          </v-stepper> -->
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
                <!-- <div class="step-label mt-2">{{ label }}</div> -->
              </div>

              <!-- 线条，最后一个不显示 -->
              <div v-if="index < stepLabels.length - 1" class="step-line" :class="{
                'done': step > index + 1,
                'pending': step <= index + 1
              }"></div>
            </template>
          </div>

          <!-- <h2 class="text-h5 mb-6 text-indigo-darken-4 font-weight-bold text-center">Step {{ step }}</h2> -->

          <!-- 渲染当前步骤的组件 -->
          <div class="step-container">
            <component 
              :is="steps[step - 1]" 
              v-if="step === 1"
              @headers-updated="handleHeadersUpdated"
            />
            <component 
              :is="steps[step - 1]" 
              v-else-if="step === 2"
              :headers="csvHeaders"
            />
            <component 
              :is="steps[step - 1]" 
              v-else
            />
          </div>

          <!-- 按钮固定到底部 -->
          <v-row justify="space-between" class="mt-6">
            <v-btn v-if="step > 1" variant="outlined" color="blue-darken-2" @click="prevStep">
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
.stepper-transparent {
  background-color: transparent !important;
  /* 设置背景透明 */
  box-shadow: none !important;
  /* 去掉阴影 */
  border: none !important;
  /* 去掉边框 */
}

.no-border {
  border: none !important;
  /* 去掉v-stepper的边框 */
}

.step-container {
  width: 100%;
  max-width: 90vw;
  min-width: 300px;
  height: 88%;
  overflow-y: auto;
  /* 当内容超出时显示垂直滚动条 */
}

/* 自定义滚动条样式 */
.step-container::-webkit-scrollbar {
  width: 8px;
  /* 设置滚动条宽度 */
}

/* 滚动条轨道 */
.step-container::-webkit-scrollbar-track {
  background: transparent;
  /* 轨道透明 */
}

/* 滚动条滑块 */
.step-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  /* 设置滑块颜色为半透明 */
  border-radius: 10px;
  /* 滑块圆角 */
}

/* 滚动条滑块悬停时 */
.step-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
  /* 悬停时颜色加深 */
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
  color: white;
  font-weight: bold;
}

.step-circle.done {
  background-color: #673ab7;
  /* 深紫色，已完成 */
}

.step-circle.active {
  background-color: #ff9800;
  /* 橙色，当前 */
}

.step-circle.pending {
  background-color: #bdbdbd;
  /* 灰色，未开始 */
}

.step-label {
  font-size: 0.75rem;
  color: #333;
  white-space: nowrap;
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
</style>