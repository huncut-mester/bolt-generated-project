<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TimelineEvent } from '../../types';

const props = defineProps<{
  events: TimelineEvent[];
}>();

const { t } = useI18n();

const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

function getEventIcon(type: string) {
  switch (type) {
    case 'case_created':
      return 'FolderPlusIcon';
    case 'status_changed':
      return 'ArrowPathIcon';
    case 'document_uploaded':
      return 'DocumentPlusIcon';
    case 'note_added':
      return 'ChatBubbleLeftIcon';
    case 'appointment_scheduled':
      return 'CalendarIcon';
    default:
      return 'CircleStackIcon';
  }
}

function getEventColor(type: string) {
  switch (type) {
    case 'case_created':
      return 'bg-green-500';
    case 'status_changed':
      return 'bg-blue-500';
    case 'document_uploaded':
      return 'bg-purple-500';
    case 'note_added':
      return 'bg-yellow-500';
    case 'appointment_scheduled':
      return 'bg-indigo-500';
    default:
      return 'bg-gray-500';
  }
}
</script>

<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        {{ t('cases.timeline') }}
      </h3>

      <div class="mt-6 flow-root">
        <ul role="list" class="-mb-8">
          <li v-for="(event, eventIdx) in sortedEvents" :key="event.id">
            <div class="relative pb-8">
              <span
                v-if="eventIdx !== events.length - 1"
                class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
              <div class="relative flex space-x-3">
                <div>
                  <span
                    :class="[
                      getEventColor(event.type),
                      'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                    ]"
                  >
                    <component
                      :is="getEventIcon(event.type)"
                      class="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p class="text-sm text-gray-500">
                      {{ event.description }}
                    </p>
                  </div>
                  <div class="whitespace-nowrap text-right text-sm text-gray-500">
                    <time :datetime="event.createdAt">
                      {{ new Date(event.createdAt).toLocaleString() }}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
