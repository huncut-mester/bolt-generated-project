<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  value: number;
  icon: string;
  trend: 'up' | 'down';
  trendValue: number;
}>();

const trendColor = computed(() => props.trend === 'up' ? 'text-green-600' : 'text-red-600');
const trendIcon = computed(() => props.trend === 'up' ? 'ArrowUpIcon' : 'ArrowDownIcon');
</script>

<template>
  <div class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
    <dt>
      <div class="absolute rounded-md bg-indigo-500 p-3">
        <component
          :is="icon"
          class="h-6 w-6 text-white"
          aria-hidden="true"
        />
      </div>
      <p class="ml-16 truncate text-sm font-medium text-gray-500">{{ title }}</p>
    </dt>
    <dd class="ml-16 flex items-baseline">
      <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
      <p
        :class="[
          'ml-2 flex items-baseline text-sm font-semibold',
          trendColor
        ]"
      >
        <component
          :is="trendIcon"
          class="h-5 w-5 flex-shrink-0 self-center"
          aria-hidden="true"
        />
        <span class="sr-only">
          {{ trend === 'up' ? 'Increased' : 'Decreased' }} by
        </span>
        {{ trendValue }}%
      </p>
    </dd>
  </div>
</template>
