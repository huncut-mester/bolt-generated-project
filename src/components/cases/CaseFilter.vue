<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CaseStatus, CaseType } from '../../types';

const props = defineProps<{
  filters: {
    status: CaseStatus[];
    type: CaseType[];
    assignedTo: number | null;
    dateRange: { start: Date; end: Date } | null;
  };
}>();

const emit = defineEmits<{
  (e: 'change', filters: typeof props.filters): void;
}>();

const { t } = useI18n();
const localFilters = ref({ ...props.filters });

const statusOptions = [
  { value: 'new', label: t('cases.status.new') },
  { value: 'in_progress', label: t('cases.status.in_progress') },
  { value: 'pending_docs', label: t('cases.status.pending_docs') },
  { value: 'under_review', label: t('cases.status.under_review') },
  { value: 'approved', label: t('cases.status.approved') },
  { value: 'rejected', label: t('cases.status.rejected') }
];

const typeOptions = [
  { value: 'residence_permit', label: t('cases.type.residence_permit') },
  { value: 'work_permit', label: t('cases.type.work_permit') },
  { value: 'citizenship', label: t('cases.type.citizenship') },
  { value: 'family_reunion', label: t('cases.type.family_reunion') }
];

watch(localFilters, (newFilters) => {
  emit('change', newFilters);
}, { deep: true });
</script>

<template>
  <div class="bg-white shadow rounded-lg p-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          {{ t('cases.filters.status') }}
        </label>
        <select
          v-model="localFilters.status"
          multiple
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          {{ t('cases.filters.type') }}
        </label>
        <select
          v-model="localFilters.type"
          multiple
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option
            v-for="option in typeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- Date Range Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          {{ t('cases.filters.dateRange') }}
        </label>
        <div class="mt-1 flex space-x-2">
          <input
            type="date"
            v-model="localFilters.dateRange.start"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <input
            type="date"
            v-model="localFilters.dateRange.end"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Assigned To Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          {{ t('cases.filters.assignedTo') }}
        </label>
        <select
          v-model="localFilters.assignedTo"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">{{ t('cases.filters.all') }}</option>
          <!-- Add dynamic user options here -->
        </select>
      </div>
    </div>
  </div>
</template>
