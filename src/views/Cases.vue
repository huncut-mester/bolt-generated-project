<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CaseList from '../components/cases/CaseList.vue';
import CaseFilter from '../components/cases/CaseFilter.vue';
import type { Case, CaseStatus, CaseType } from '../types';

const { t } = useI18n();
const cases = ref<Case[]>([]);
const loading = ref(true);
const filters = ref({
  status: [] as CaseStatus[],
  type: [] as CaseType[],
  assignedTo: null as number | null,
  dateRange: null as { start: Date; end: Date } | null
});

onMounted(async () => {
  try {
    // Fetch cases with filters
    loading.value = true;
    // cases.value = await fetchCases(filters.value);
  } finally {
    loading.value = false;
  }
});

function handleFilterChange(newFilters: typeof filters.value) {
  filters.value = newFilters;
  // Refetch cases with new filters
}
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">{{ t('cases.title') }}</h1>
        <button
          type="button"
          class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          {{ t('cases.newCase') }}
        </button>
      </div>

      <!-- Filters -->
      <CaseFilter
        :filters="filters"
        @change="handleFilterChange"
        class="mt-6"
      />

      <!-- Case List -->
      <div class="mt-8">
        <CaseList
          :cases="cases"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>
