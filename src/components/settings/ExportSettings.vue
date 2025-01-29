<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { saveAs } from 'file-saver';
import { exportApi } from '../../services/api';

const { t } = useI18n();
const exporting = ref(false);
const dateRange = ref({
  start: '',
  end: ''
});
const selectedFormat = ref('csv');
const selectedData = ref(['cases', 'documents']);
const includeMetadata = ref(true);

async function handleExport() {
  try {
    exporting.value = true;
    const response = await exportApi.exportData({
      dateRange: dateRange.value,
      format: selectedFormat.value,
      data: selectedData.value,
      includeMetadata: includeMetadata.value
    });

    const filename = `export-${new Date().toISOString()}.${selectedFormat.value}`;
    saveAs(new Blob([response.data]), filename);
  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ t('export.title') }}
        </h3>
        <div class="mt-6 space-y-6">
          <!-- Date Range -->
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label for="start-date" class="block text-sm font-medium text-gray-700">
                {{ t('export.startDate') }}
              </label>
              <div class="mt-1">
                <input
                  type="date"
                  id="start-date"
                  v-model="dateRange.start"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label for="end-date" class="block text-sm font-medium text-gray-700">
                {{ t('export.endDate') }}
              </label>
              <div class="mt-1">
                <input
                  type="date"
                  id="end-date"
                  v-model="dateRange.end"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Export Format -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('export.format') }}
            </label>
            <div class="mt-2 space-y-4">
              <div class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedFormat"
                  value="csv"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  CSV
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedFormat"
                  value="xlsx"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  Excel (XLSX)
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedFormat"
                  value="pdf"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  PDF
                </label>
              </div>
            </div>
          </div>

          <!-- Data Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('export.includeData') }}
            </label>
            <div class="mt-2 space-y-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  value="cases"
                  v-model="selectedData"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  {{ t('export.cases') }}
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  value="documents"
                  v-model="selectedData"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  {{ t('export.documents') }}
                </label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  value="timeline"
                  v-model="selectedData"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label class="ml-3 block text-sm font-medium text-gray-700">
                  {{ t('export.timeline') }}
                </label>
              </div>
            </div>
          </div>

          <!-- Additional Options -->
          <div class="flex items-start">
            <div class="flex h-5 items-center">
              <input
                type="checkbox"
                v-model="includeMetadata"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div class="ml-3 text-sm">
              <label class="font-medium text-gray-700">
                {{ t('export.includeMetadata') }}
              </label>
              <p class="text-gray-500">
                {{ t('export.metadataDescription') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        @click="handleExport"
        :disabled="exporting || selectedData.length === 0"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <template v-if="exporting">
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {{ t('export.exporting') }}
        </template>
        <template v-else>
          {{ t('export.export') }}
        </template>
      </button>
    </div>
  </div>
</template>
