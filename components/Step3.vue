<template>
  <div class="layout-container">
    <div v-if="!isConfirmed" class="selection-container">
      <!-- 左侧列表 -->
      <div class="list-container">
        <h3>All Headers</h3>
        <v-list
          v-model:selected="selectedItems"
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

      <!-- 中间按钮组 -->
      <div class="button-group">
        <v-btn
          color="primary"
          @click="moveToRight"
          :disabled="!selectedItems.length"
        >
          Move to Right
        </v-btn>
        <v-btn
          color="secondary"
          @click="moveBackToLeft"
          :disabled="!selectedRightItems.length"
        >
          Move to Left
        </v-btn>
      </div>

      <!-- 右侧列表 -->
      <div class="list-container">
        <h3>Selected Headers</h3>
        <v-list
          v-model:selected="selectedRightItems"
          select-strategy="multiple"
          class="list-box"
        >
          <v-list-item
            v-for="item in rightItems"
            :key="item"
            :value="item"
            :title="item"
            class="list-item"
          ></v-list-item>
        </v-list>
      </div>
    </div>

    <div class="step-actions mt-4" v-if="!isConfirmed">
      <v-btn
        color="primary"
        @click="confirmSelection"
        :disabled="!rightItems.length"
      >
        Confirm
      </v-btn>
    </div>

    <!-- 显示结果表格和图表 -->
    <div v-if="isConfirmed">
      <div v-if="results.length">
        <h3>Validation Results</h3>
        <v-data-table
          :headers="resultsHeaders"
          :items="results"
        ></v-data-table>
      </div>

      <!-- ECharts 图表 -->
      <div class="charts-container">
        <div id="barChart" style="width: 100%; height: 400px;"></div>
        <div id="lineChart" style="width: 100%; height: 400px;"></div>
        <div id="scatterChart" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

// 本地状态
const allHeaders = ref([]) // 从 Step1 获取的所有 headers
const selectedItems = ref([]) // 左侧选中的项
const selectedRightItems = ref([]) // 右侧选中的项
const results = ref([]) // API 返回的结果
const resultsHeaders = ref([]) // 表格的表头
const rightItems = ref([])
const isConfirmed = ref(false) // 控制是否确认选择的状态

const props = defineProps({
  headers: {
    type: Array,
    required: true
  }
})

// 移动到右侧
const moveToRight = () => {
  rightItems.value = [...new Set([...rightItems.value, ...selectedItems.value])]
  allHeaders.value = allHeaders.value.filter(item => !selectedItems.value.includes(item))
  selectedItems.value = []
}

// 移动到左侧
const moveBackToLeft = () => {
  const itemsToMove = [...selectedRightItems.value]
  allHeaders.value = [...new Set([...allHeaders.value, ...itemsToMove])]
  rightItems.value = rightItems.value.filter(item => !selectedRightItems.value.includes(item))
  selectedRightItems.value = []
}

// 确认选择并调用 API
const confirmSelection = async () => {
  /*
  try {
    // 构建请求体，假设 API 需要一个包含选中字段的数组
    const requestBody = {
      headers: selectedRightItems.value // 发送选中的字段
    };

    // 调用真实的 API
    const response = await fetch('https://api.example.com/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // 解析 JSON 响应
    const data = await response.json();
    results.value = data.results; // 假设 API 返回的结果在 results 字段中
    resultsHeaders.value = Object.keys(data.results[0]).map(key => ({ text: key, value: key }));

    // 设置确认状态为 true
    isConfirmed.value = true;

    // 确保 DOM 更新完成后再绘制图表
    await nextTick();
    drawCharts();
  } catch (error) {
    console.error('Error fetching data:', error);
    // 处理错误，例如显示错误消息
  }
    */
     // 假数据
  const fakeApiResponse = [
    { header: 'Header 1', status: 'Valid' },
    { header: 'Header 2', status: 'Invalid' },
  ]
  results.value = fakeApiResponse
  resultsHeaders.value = Object.keys(fakeApiResponse[0]).map(key => ({ text: key, value: key }))
  // 设置确认状态为 true
  isConfirmed.value = true
  // 确保 DOM 更新完成后再绘制图表
  await nextTick()
  drawCharts()
}

// 绘制图表
const drawCharts = () => {
  // 柱状图
  const barChart = echarts.init(document.getElementById('barChart'))
  barChart.setOption({
    title: { text: 'Bar Chart' },
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [10, 20, 30] }]
  })

  // 折线图
  const lineChart = echarts.init(document.getElementById('lineChart'))
  lineChart.setOption({
    title: { text: 'Line Chart' },
    xAxis: { type: 'category', data: ['A', 'B', 'C'] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [10, 20, 30] }]
  })

  // 散点图
  const scatterChart = echarts.init(document.getElementById('scatterChart'))
  scatterChart.setOption({
    title: { text: 'Scatter Chart' },
    xAxis: { type: 'value' },
    yAxis: { type: 'value' },
    series: [{ type: 'scatter', data: [[10, 10], [20, 20], [30, 30]] }]
  })
}

watch(() => props.headers, (newHeaders) => {
  allHeaders.value = [...newHeaders]
}, { immediate: true })
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column; /* 修改为垂直方向布局 */
  gap: 20px;
  padding: 20px;
}

.selection-container {
  display: flex; /* 使用 flexbox 布局 */
  gap: 20px; /* 设置左右间距 */
}

.list-container {
  flex: 1; /* 使左右列表均分空间 */
  padding: 10px;
}

.button-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.charts-container {
  margin-top: 20px;
}
.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
  padding: 10px 0;
  z-index: 1;
}
</style>
  