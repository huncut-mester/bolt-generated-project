<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import CaseTimeline from '../components/cases/CaseTimeline.vue';
import DocumentList from '../components/documents/DocumentList.vue';
import CaseInfo from '../components/cases/CaseInfo.vue';
import type { Case, Document, TimelineEvent } from '../types';

const route = useRoute();
const { t } = useI18n();
const caseId = route.params.id as string;

const caseData = ref<Case | null>(null);
const documents = ref<Document[]>([]);
const timeline = ref<TimelineEvent[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    // Fetch case details, documents, and timeline
    // const [caseDetails, caseDocuments, caseTimeline] = await Promise.all([
    //   fetchCase(caseId),
    //   fetchDocuments(caseId),
    //   fetchTimeline(caseId)
    // ]);
    // caseData.value = caseDetails;
    // documents.value = caseDocuments;
    // timeline.value = caseTimeline;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-8 bg-gray-200 rounded w-1/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <template v-else-if="caseData">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              {{ t('cases.type.' + caseData.type) }} - #{{ caseData.id }}
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              {{ t('cases.lastUpdated', { date: new Date(caseData.updatedAt).toLocaleDateString() }) }}
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ t('common.edit') }}
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {{ t('documents.upload') }}
            </button>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Case Information -->
          <div class="lg:col-span-2">
            <CaseInfo :case="caseData" />
            
            <!-- Documents Section -->
            <div class="mt-6">
              <DocumentList
                :documents="documents"
                :case-id="caseId"
                class="mt-4"
              />
            </div>
          </div>

          <!-- Timeline -->
          <div>
            <CaseTimeline :events="timeline" />
          </div>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">{{ t('cases.notFound') }}</p>
      </div>
    </div>
  </div>
</template>
