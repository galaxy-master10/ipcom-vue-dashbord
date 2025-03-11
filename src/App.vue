<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="surface">
      <v-list>
        <v-list-item class="mb-6">
          <v-list-item-title class="text-h5 text-primary">
            <v-img
              src="src/assets/logo.png"
              alt="Logo"
              max-width="160"
              max-height="160"
              rounded="circle"
            ></v-img>
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


        <v-divider class="my-3"></v-divider>
        <v-list-item
          v-if="isAuthenticated"
          prepend-icon="mdi-logout"
          title="Logout"
          @click="handleLogout"
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

      <!-- Authentication button -->
      <v-btn v-if="!isAuthenticated" @click="microsoftLogin" color="primary" class="mr-3">
        <v-icon left>mdi-microsoft</v-icon>
        Login with Microsoft
      </v-btn>
      <v-btn v-else color="success" class="mr-3" disabled>
        <v-icon left>mdi-check</v-icon>
        Authenticated
      </v-btn>

      <v-btn @click="toggleTheme" icon>
        <v-icon>{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>

      <v-alert
        v-if="authError"
        type="error"
        closable
        class="ma-3"
        @click:close="authError = null"
      >
        {{ authError }}
        <v-btn @click="microsoftLogin" color="white" class="ml-2" size="small">
          Retry
        </v-btn>
      </v-alert>

      <!-- Authentication check before rendering the main content -->
      <v-container v-if="isAuthenticated">
        <router-view></router-view>
      </v-container>

      <!-- Authentication required message when not authenticated -->
      <v-container v-else class="d-flex flex-column align-center justify-center" style="height: 80vh">
        <v-icon size="64" color="primary" class="mb-4">mdi-account-lock</v-icon>
        <h2 class="text-h4 mb-4">Authentication Required</h2>
        <p class="text-body-1 text-center mb-6">Please log in with your Microsoft account to access the application.</p>
        <v-btn color="primary" size="large" @click="microsoftLogin">
          <v-icon left>mdi-microsoft</v-icon>
          Login with Microsoft
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'
import AuthService from '@/auth/authService.js'

const drawer = ref(true)
const theme = useTheme()
const route = useRoute()
const isAuthenticated = ref(false)
const authError = ref(null)
const isLoading = ref(true)

// Login with Microsoft
const microsoftLogin = async () => {
  try {
    authError.value = null;
    await AuthService.login();
    console.log("log before showing account")
    console.log(AuthService.account)

  } catch (error) {
    console.error("Login error:", error);
    authError.value = 'Failed to login. Please try again.';
  }
}

// Check authentication status
const checkAuthentication = async () => {
  try {
    isLoading.value = true;

    await AuthService.initialize();


    const response = await AuthService.handleRedirectPromise();

    if (response) {
      console.log("Login successful via redirect");
      isAuthenticated.value = true;
    } else {

      isAuthenticated.value = await AuthService.isAuthenticated();
    }

    isLoading.value = false;
  } catch (error) {
    console.error("Authentication check failed:", error);
    authError.value = "Failed to check authentication status. Please try again.";
    isAuthenticated.value = false;
    isLoading.value = false;
  }
}

const handleLogout = async () => {
  try {
    await AuthService.logout();
    isAuthenticated.value = false;
  } catch (error) {
    console.error("Logout failed:", error);
    authError.value = "Failed to logout. Please try again.";
  }
}

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

const currentPageTitle = computed(() => {
  const currentPath = route.path
  const menuItem = menuItems.find(item => item.path === currentPath)
  return menuItem ? menuItem.title : 'Dashboard'
})

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark'
}

// Check authentication when the component is mounted
onMounted(async () => {
  await checkAuthentication();
})
</script>

<style scoped>
.v-list-item {
  margin-inline: 0.5rem;
}
</style>
