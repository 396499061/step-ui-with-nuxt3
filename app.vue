<script setup lang="ts">
const pages = [
  { title: 'Home', path: '/main', icon: 'mdi-home' },
  { title: 'About', path: '/about', icon: 'mdi-information' },
  { title: 'Settings', path: '/settings', icon: 'mdi-cog' }
]
</script>

<template>
  <v-app>
    <!-- 左侧导航栏 -->
    <v-navigation-drawer
      permanent
      width="240"
      class="nav-drawer"
    >
      <!-- Logo 部分 -->
      <div class="d-flex align-center pa-3">
        <img src="/images/company-logo.png" alt="Company Logo" height="32" class="me-2" />
        <v-divider vertical class="mx-2" color="white" />
        <img src="/images/product-logo.png" alt="Product Logo" height="32" />
      </div>
      <v-divider color="white" class="mb-4" />
      
      <!-- 导航菜单 -->
      <v-list nav dense>
        <NuxtLink
          v-for="page in pages"
          :key="page.path"
          :to="page.path"
          custom
          v-slot="{ navigate, isActive }"
        >
          <v-list-item
            @click="navigate"
            :active="isActive"
            :title="page.title"
            :prepend-icon="page.icon"
            class="rounded-lg my-1"
            :class="isActive ? 'bg-deep-purple-lighten-4' : 'hover:bg-deep-purple-lighten-5'"
          />
        </NuxtLink>
      </v-list>
    </v-navigation-drawer>

    <!-- 右侧内容区域 -->
    <div class="content-wrapper">
      <!-- 顶部 Banner -->
      <v-app-bar color="indigo-darken-3" flat class="content-banner" height="48">
        <v-app-bar-title>
          <span class="text-subtitle-1 font-weight-medium">数据上传系统</span>
        </v-app-bar-title>
      </v-app-bar>

      <!-- 页面内容渲染 -->
      <div class="content-container">
        <NuxtPage />
      </div>
    </div>
  </v-app>
</template>

<style scoped>
/* 全局字体设置 */
:deep(*) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
}

/* 提升菜单项 hover 效果 */
.hover\:bg-deep-purple-lighten-5:hover {
  background-color: #ede7f6 !important;
}

/* 将背景图应用到 nav-drawer 根元素 */
.nav-drawer {
  background-color: #283593 !important;
  height: 100vh !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
}

/* 让内部内容容器透明，并添加背景图 */
.nav-drawer :deep(.v-navigation-drawer__content) {
  background: url('/nav-bg.svg') center/cover no-repeat !important;
  background-blend-mode: overlay !important;
}

/* 右侧内容区域样式 */
.content-wrapper {
  margin-left: 240px;
  width: calc(100% - 240px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Banner 样式 */
.content-banner {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  left: 240px !important;
  z-index: 100 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

/* Banner 标题样式 */
.content-banner :deep(.v-app-bar-title) {
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}

/* 导航菜单项样式 */
.nav-drawer :deep(.v-list-item) {
  font-weight: 500 !important;
  letter-spacing: 0.3px !important;
  font-size: 1.4rem !important;
  padding: 14px 20px !important;
  color: rgba(255, 255, 255, 0.9) !important;
  transition: all 0.3s ease !important;
}

.nav-drawer :deep(.v-list-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  transform: translateX(4px) !important;
}

.nav-drawer :deep(.v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

.nav-drawer :deep(.v-list-item__prepend) {
  font-size: 1.35rem !important;
  margin-right: 20px !important;
  color: inherit !important;
}

.nav-drawer :deep(.v-list-item__title) {
  font-size: 1.4rem !important;
  line-height: 1.6 !important;
  color: inherit !important;
}

/* 内容容器样式 */
.content-container {
  margin-top: 48px;
  padding: 24px;
  flex: 1;
}

:deep(.v-btn) {
  background-color: #da0011 !important;
  font-weight: 500 !important;
}

:deep(.v-btn--text) {
  color: #da0011 !important;
}
</style>
