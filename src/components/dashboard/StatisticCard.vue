<script setup lang="ts">
import { computed } from 'vue';
import Card from '../common/Card.vue';

interface Props {
  title: string;
  value: number | string;
  change?: number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const props = defineProps<Props>();

const trendColor = computed(() => {
  if (!props.trend) return 'text-gray-500';
  return {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-gray-500'
  }[props.trend];
});

const trendIcon = computed(() => {
  if (!props.trend) return null;
  return {
    up: 'ArrowUpIcon',
    down: 'ArrowDownIcon',
    neutral: 'MinusIcon'
  }[props.trend];
});
</script>

<template>
  <Card glass hover>
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-500">
            {{ title }}
          </h3>
          
          <div class="mt-2 flex items-baseline">
            <template v-if="loading">
              <div class="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            </template>
            <template v-else>
              <p class="text-2xl font-semibold text-gray-900">
                {{ value }}
              </p>
              <template v-if="change !== undefined">
                <span
                  :class="[
                    'ml-2 text-sm',
                    trendColor
                  ]"
                >
                  <component
                    :is="trendIcon"
                    class="inline-block h-4 w-4"
                  />
                  {{ Math.abs(change) }}%
                </span>
              </template>
            </template>
          </div>
        </div>
        
        <div
          v-if="icon"
          class="p-3 bg-primary/10 rounded-full"
        >
          <component
            :is="icon"
            class="h-6 w-6 text-primary"
          />
        </div>
      </div>
    </div>
  </Card>
</template>
