<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  duration?: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function handleClose() {
  emit('close');
}

onMounted(() => {
  if (props.duration) {
    setTimeout(handleClose, props.duration);
  }
});

onUnmounted(() => {
  // Cleanup if needed
});
</script>

<template>
  <div
    class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <XCircleIcon
            v-if="type === 'error'"
            class="h-6 w-6 text-red-400"
            aria-hidden="true"
          />
          <ExclamationTriangleIcon
            v-else-if="type === 'warning'"
            class="h-6 w-6 text-yellow-400"
            aria-hidden="true"
          />
          <InformationCircleIcon
            v-else
            class="h-6 w-6 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p v-if="title" class="text-sm font-medium text-gray-900">
            {{ title }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ message }}
          </p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            @click="handleClose"
            class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="sr-only">Close</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
