<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/auth';
import { userApi } from '../services/api';
import ProfileForm from '../components/profile/ProfileForm.vue';
import SecuritySettings from '../components/profile/SecuritySettings.vue';
import ActivityLog from '../components/profile/ActivityLog.vue';

const { t } = useI18n();
const auth = useAuthStore();
const loading = ref(true);
const activeTab = ref('profile');
const profileData = ref(null);
const activityLog = ref([]);

async function fetchProfileData() {
  try {
    loading.value = true;
    const [profile, activity] = await Promise.all([
      userApi.getProfile(),
      userApi.getActivityLog({ limit: 10 })
    ]);
    profileData.value = profile.data;
    activityLog.value = activity.data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchProfileData);
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ t('profile.title') }}
        </h1>
      </div>

      <div class="mt-6">
        <div class="sm:hidden">
          <select
            v-model="activeTab"
            class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="profile">{{ t('profile.tabs.profile') }}</option>
            <option value="security">{{ t('profile.tabs.security') }}</option>
            <option value="activity">{{ t('profile.tabs.activity') }}</option>
          </select>
        </div>

        <div class="hidden sm:block">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                v-for="tab in ['profile', 'security', 'activity']"
                :key="tab"
                @click="activeTab = tab"
                :class="[
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                ]"
              >
                {{ t(`profile.tabs.${tab}`) }}
              </button>
            </nav>
          </div>
        </div>

        <div class="mt-6">
          <div v-if="loading" class="animate-pulse space-y-4">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="space-y-3">
              <div class="h-8 bg-gray-200 rounded"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>

          <template v-else>
            <ProfileForm
              v-if="activeTab === 'profile'"
              :profile-data="profileData"
              @update="fetchProfileData"
            />

            <SecuritySettings
              v-else-if="activeTab === 'security'"
              :mfa-enabled="profileData?.mfaEnabled"
              @update="fetchProfileData"
            />

            <ActivityLog
              v-else-if="activeTab === 'activity'"
              :activity-log="activityLog"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
