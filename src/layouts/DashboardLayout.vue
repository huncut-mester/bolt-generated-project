<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useI18n } from 'vue-i18n';

const auth = useAuthStore();
const { t } = useI18n();
const isSidebarOpen = ref(true);

const navigation = [
  { name: t('dashboard.home'), icon: 'HomeIcon', route: '/' },
  { name: t('dashboard.cases'), icon: 'FolderIcon', route: '/cases' },
  { name: t('dashboard.clients'), icon: 'UsersIcon', route: '/clients' },
  { name: t('dashboard.documents'), icon: 'DocumentIcon', route: '/documents' },
  { name: t('dashboard.reports'), icon: 'ChartBarIcon', route: '/reports' },
];

const userNavigation = [
  { name: t('dashboard.profile'), route: '/profile' },
  { name: t('dashboard.settings'), route: '/settings' },
];
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex h-16 items-center justify-between px-4">
        <img class="h-8 w-auto" src="/logo.svg" alt="Company Logo" />
        <button
          @click="isSidebarOpen = false"
          class="text-gray-400 hover:text-white lg:hidden"
        >
          <span class="sr-only">{{ t('dashboard.closeSidebar') }}</span>
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <nav class="mt-5 space-y-1 px-2">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.route"
          class="group flex items-center px-2 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <component
            :is="item.icon"
            class="mr-4 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-white"
          />
          {{ item.name }}
        </router-link>
      </nav>
    </div>

    <!-- Main content -->
    <div :class="['lg:pl-64', isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0']">
      <!-- Top navbar -->
      <div class="fixed top-0 z-40 flex h-16 w-full items-center bg-white px-4 shadow">
        <button
          @click="isSidebarOpen = true"
          class="text-gray-500 hover:text-gray-700 lg:hidden"
        >
          <span class="sr-only">{{ t('dashboard.openSidebar') }}</span>
          <MenuIcon class="h-6 w-6" />
        </button>

        <!-- Search -->
        <div class="ml-4 flex flex-1">
          <div class="relative w-full max-w-xs">
            <input
              type="text"
              class="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500"
              :placeholder="t('dashboard.search')"
            />
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon class="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <!-- User menu -->
        <div class="ml-4 flex items-center">
          <Menu as="div" class="relative ml-3">
            <MenuButton
              class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">{{ t('dashboard.openUserMenu') }}</span>
              <img
                class="h-8 w-8 rounded-full"
                :src="auth.user?.avatarUrl || '/default-avatar.png'"
                alt=""
              />
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <router-link
                    :to="item.route"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    ]"
                  >
                    {{ item.name }}
                  </router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    @click="auth.logout"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                    ]"
                  >
                    {{ t('dashboard.logout') }}
                  </a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>

      <!-- Page content -->
      <main class="py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-gray-900 text-white;
}
</style>
