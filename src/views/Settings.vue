<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { settingsApi } from '../services/api';
import SystemSettings from '../components/settings/SystemSettings.vue';
import NotificationSettings from '../components/settings/NotificationSettings.vue';
import ExportSettings from '../components/settings/ExportSettings.vue';
import AuditLog from '../components/settings/AuditLog.vue';

const { t } = useI18n();
const activeTab = ref('system');
const loading = ref(true);
const settings = ref(null);

async function fetchSettings() {
  try {
    loading.value = true;
    const response = await settingsApi.getSettings();
    settings.value = response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchSettings);
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ t('settings.title') }}
        </h1>
      </div>

      <div class="mt-6">
        <div class="sm:hidden">
          <select
            v-model="activeTab"
            class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="system">{{ t('settings.tabs.system') }}</option>
            <option value="notifications">{{ t('settings.tabs.notifications') }}</option>
            <option value="export">{{ t('settings.tabs.export') }}</option>
            <option value="audit">{{ t('settings.tabs.audit') }}</option>
          </select>
        </div>

        <div class="hidden sm:block">
          <nav class="flex space-x-4" aria-label="Tabs">
            <button
              v-for="tab in ['system', 'notifications', 'export', 'audit']"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                activeTab === tab
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700',
                'px-3 py-2 font-medium text-sm rounded-md'
              ]"
            >
              {{ t(`settings.tabs.${tab}`) }}
            </button>
          </nav>
        </div>

        <div class="mt-8">
          <div v-if="loading" class="animate-pulse space-y-4">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="space-y-3">
              <div class="h-8 bg-gray-200 rounded"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>

          <template v-else>
            <SystemSettings
              v-if="activeTab === 'system'"
              :settings="settings"
              @update="fetchSettings"
            />

            <NotificationSettings
              v-else-if="activeTab === 'notifications'"
              :settings="settings"
              @update="fetchSettings"
            />

            <ExportSettings
              v-else-if="activeTab === 'export'"
              :settings="settings"
            />

            <AuditLog
              v-else-if="activeTab === 'audit'"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
