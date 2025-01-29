<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Case } from '../../types';

const props = defineProps<{
  case: Case;
}>();

const { t } = useI18n();

const statusColor = computed(() => {
  switch (props.case.status) {
    case 'new':
      return 'bg-gray-100 text-gray-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending_docs':
      return 'bg-yellow-100 text-yellow-800';
    case 'under_review':
      return 'bg-purple-100 text-purple-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});
</script>

<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ t('cases.details') }}
          </h3>
          <dl class="mt-4 space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                {{ t('cases.type.label') }}
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ t(`cases.type.${case.type}`) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                {{ t('cases.status.label') }}
              </dt>
              <dd class="mt-1">
                <span
                  :class="[
                    statusColor,
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                  ]"
                >
                  {{ t(`cases.status.${case.status}`) }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                {{ t('cases.assignedTo') }}
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ case.assignedTo }}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {{ t('cases.dates') }}
          </h3>
          <dl class="mt-4 space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">
                {{ t('cases.created') }}
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(case.createdAt).toLocaleDateString() }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">
                {{ t('cases.updated') }}
              </dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(case.updatedAt).toLocaleDateString() }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
