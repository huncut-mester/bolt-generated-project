<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Document } from '../../types';

const props = defineProps<{
  documents: Document[];
  caseId: string;
}>();

const { t } = useI18n();
const uploading = ref(false);
const uploadProgress = ref(0);
const selectedFiles = ref<FileList | null>(null);

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  try {
    uploading.value = true;
    selectedFiles.value = input.files;
    
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      // Simulate upload progress
      uploadProgress.value = (i + 1) / input.files.length * 100;
      
      // Here you would normally upload the file
      // await uploadDocument(props.caseId, file);
    }
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
    selectedFiles.value = null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
</script>

<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ t('documents.title') }}
        </h3>
        <div class="flex items-center">
          <label
            :class="[
              'cursor-pointer inline-flex items-center px-4 py-2 border border-transparent',
              'text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700',
              { 'opacity-50 cursor-not-allowed': uploading }
            ]"
          >
            <input
              type="file"
              class="hidden"
              multiple
              @change="handleFileUpload"
              :disabled="uploading"
            />
            {{ t('documents.upload') }}
          </label>
        </div>
      </div>

      <!-- Upload Progress -->
      <div v-if="uploading" class="mt-4">
        <div class="relative pt-1">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block text-indigo-600">
                {{ t('documents.uploading') }}
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block text-indigo-600">
                {{ Math.round(uploadProgress) }}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
            <div
              :style="{ width: `${uploadProgress}%` }"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            ></div>
          </div>
        </div>
      </div>

      <!-- Document List -->
      <div class="mt-6 flow-root">
        <ul role="list" class="-my-5 divide-y divide-gray-200">
          <li v-for="doc in documents" :key="doc.id" class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <DocumentIcon class="h-8 w-8 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ doc.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ formatFileSize(doc.size) }} • 
                  {{ new Date(doc.uploadedAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="flex-shrink-0 space-x-2">
                <button
                  type="button"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  {{ t('common.download') }}
                </button>
                <button
                  type="button"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200"
                >
                  {{ t('common.delete') }}
                </button>
              </div>
            </div>
          </li>

          <li v-if="documents.length === 0" class="py-4 text-center text-gray-500">
            {{ t('documents.noDocuments') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
