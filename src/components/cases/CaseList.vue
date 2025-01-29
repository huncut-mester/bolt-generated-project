<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Case } from '../../types';

const props = defineProps<{
  cases: Case[];
  loading: boolean;
}>();

const { t } = useI18n();

const statusColors = {
  new: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  pending_docs: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
} as const;

function getStatusColor(status: keyof typeof statusColors) {
  return statusColors[status] || statusColors.new;
}

const sortedCases = computed(() => {
  return [...props.cases].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
});
</script>

<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li v-if="loading" class="p-4">
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
        v-for="case in sortedCases"
        :key="case.id"
        class="hover:bg-gray-50"
      >
        <router-link
          :to="`/cases/${case.id}`"
          class="block"
        >
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p class="truncate text-sm font-medium text-indigo-600">
                  {{ case.type }}
                </p>
                <span
                  :class="[
                    getStatusColor(case.status),
                    'ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                  ]"
                >
                  {{ t(`cases.status.${case.status}`) }}
                </span>
              </div>
              <div class="ml-2 flex flex-shrink-0">
                <p class="text-sm text-gray-500">
                  {{ new Date(case.updatedAt).toLocaleDateString() }}
                </p>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  <UserIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                  {{ case.clientId }}
                </p>
                <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  <UserCircleIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                  {{ case.assignedTo }}
                </p>
              </div>
            </div>
          </div>
        </router-link>
      </li>

      <li v-if="!loading && cases.length === 0" class="p-4 text-center text-gray-500">
        {{ t('cases.noCases') }}
      </li>
    </ul>
  </div>
</template>
