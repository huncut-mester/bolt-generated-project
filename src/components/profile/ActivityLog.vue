<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { userApi } from '../../services/api';

const props = defineProps<{
  activityLog: any[];
}>();

const { t } = useI18n();
const loading = ref(false);
const activities = ref(props.activityLog);
const page = ref(1);
const hasMore = ref(true);

async function loadMore() {
  if (!hasMore.value || loading.value) return;
  
  try {
    loading.value = true;
    page.value++;
    const response = await userApi.getActivityLog({
      page: page.value,
      limit: 10
    });
    
    activities.value = [...activities.value, ...response.data];
    hasMore.value = response.data.length === 10;
  } catch (error) {
    console.error('Error loading activities:', error);
  } finally {
    loading.value = false;
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'login':
      return 'LoginIcon';
    case 'logout':
      return 'LogoutIcon';
    case 'profile_update':
      return 'UserIcon';
    case 'password_change':
      return 'KeyIcon';
    case 'mfa_update':
      return 'ShieldCheckIcon';
    default:
      return 'ClockIcon';
  }
}
</script>

<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        {{ t('profile.activityLog') }}
      </h3>

      <div class="mt-6 flow-root">
        <ul role="list" class="-mb-8">
          <li v-for="activity in activities" :key="activity.id">
            <div class="relative pb-8">
              <span
                class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
              <div class="relative flex space-x-3">
                <div>
                  <span
                    :class="[
                      'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                      {
                        'bg-green-500': activity.type === 'login',
                        'bg-red-500': activity.type === 'logout',
                        'bg-blue-500': activity.type === 'profile_update',
                        'bg-yellow-500': activity.type === 'password_change',
                        'bg-purple-500': activity.type === 'mfa_update',
                        'bg-gray-500': !['login', 'logout', 'profile_update', 'password_change', 'mfa_update'].includes(activity.type)
                      }
                    ]"
                  >
                    <component
                      :is="getActivityIcon(activity.type)"
                      class="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ t(`activity.${activity.type}`) }}
                      <span class="font-medium text-gray-900">
                        {{ activity.details }}
                      </span>
                    </p>
                  </div>
                  <div class="whitespace-nowrap text-right text-sm text-gray-500">
                    <time :datetime="activity.timestamp">
                      {{ new Date(activity.timestamp).toLocaleString() }}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="hasMore" class="mt-6 flex justify-center">
          <button
            @click="loadMore"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ loading ? t('common.loading') : t('activity.loadMore') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
