<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Case } from '../../types';

const { t } = useI18n();
const recentCases = ref<Case[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // Fetch recent cases
    loading.value = true;
    // recentCases.value = await fetchRecentCases();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="bg-white shadow rounded-lg">
    <div class="p-6">
      <h2 class="text-lg font-medium text-gray-900">
        {{ t('dashboard.recentCases') }}
      </h2>
      
      <div class="mt-6 flow-root">
        <ul role="list" class="-my-5 divide-y divide-gray-200">
          <li v-if="loading" class="py-4">
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-4 py-1">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded"></div>
                  <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </li>

          <li
            v-for="case in recentCases"
            :key="case.id"
            class="py-4"
          >
            <div class="flex items-center space-x-4">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ case.type }}
                </p>
                <p class="text-sm text-gray-500 truncate">
                  {{ t('cases.status.' + case.status) }}
                </p>
              </div>
              <div class="flex-shrink-0">
                <router-link
                  :to="`/cases/${case.id}`"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  {{ t('common.view') }}
                </router-link>
              </div>
            </div>
          </li>

          <li v-if="!loading && recentCases.length === 0" class="py-4 text-center text-gray-500">
            {{ t('dashboard.noCases') }}
          </li>
        </ul>
      </div>

      <div class="mt-6">
        <router-link
          to="/cases"
          class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          {{ t('dashboard.viewAllCases') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
