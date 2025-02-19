<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="surface">
      <v-list>
        <v-list-item class="mb-6">
          <v-list-item-title class="text-h5 text-primary">
            Dashboard DB..
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :prepend-icon="item.icon"
          :title="item.title"
          class="mb-2"
          rounded="lg"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-app-bar-title>{{currentPageTitle}}</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn @click="toggleTheme" icon>
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'

const drawer = ref(true)
const theme = useTheme()
const route = useRoute()


const isDark = computed(() => theme.global.current.value.dark)

const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    path: '/'
  },
  {
    title: 'Articles',
    icon: 'mdi-package-variant-closed',
    path: '/articles'
  },
  {
    title: 'Stock',
    icon: 'mdi-package',
    path: '/stock'
  },
  {
    title: 'Packaging',
    icon: 'mdi-box',
    path: '/packaging'
  },
  {
    title: 'Customers',
    icon: 'mdi-account-group',
    path: '/customers'
  }
]
// Compute current page title based on route
const currentPageTitle = computed(() => {
  const currentPath = route.path
  const menuItem = menuItems.find(item => item.path === currentPath)
  return menuItem ? menuItem.title : 'Dashboard DB..'
})
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}
</script>

<style scoped>
.v-list-item {
  margin-inline: 0.5rem;
}
</style>
