<script setup lang="ts">
const pages = [
  { title: 'Home', path: '/main', icon: 'mdi-home' },
  { title: 'About', path: '/about', icon: 'mdi-information' },
  { title: 'Settings', path: '/settings', icon: 'mdi-cog' }
]
</script>

<template>
  <v-app>
    <!-- 顶部 Banner -->
    <v-app-bar color="indigo-darken-4" flat>
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="me-2" size="28" color="deep-purple-lighten-3">mdi-apps</v-icon>
        <span class="text-h6 font-weight-bold text-white">My Awesome App</span>
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="d-flex">
      <!-- 左侧导航栏 -->
      <v-navigation-drawer
        permanent
        color="indigo-lighten-5"
        width="240"
        class="pt-4 px-2"
      >
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

      <!-- 页面内容渲染 -->
      <v-container fluid class="pa-6">
        <NuxtPage />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* 提升菜单项 hover 效果 */
.hover\:bg-deep-purple-lighten-5:hover {
  background-color: #ede7f6 !important;
}

</style>
