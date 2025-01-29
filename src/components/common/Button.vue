<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: boolean;
  rounded?: boolean;
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  icon: false,
  rounded: false,
  block: false
});

const classes = computed(() => {
  return {
    // Base styles
    'inline-flex items-center justify-center font-medium transition-all': true,
    'focus:outline-none focus:ring-2 focus:ring-offset-2': true,
    
    // Variants
    'bg-primary text-white hover:bg-primary-dark focus:ring-primary': props.variant === 'primary',
    'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary': props.variant === 'secondary',
    'bg-accent text-white hover:bg-accent-dark focus:ring-accent': props.variant === 'accent',
    'bg-transparent hover:bg-gray-100 text-gray-700': props.variant === 'ghost',
    
    // Sizes
    'text-sm px-3 py-2 gap-2': props.size === 'sm',
    'text-base px-4 py-2 gap-2': props.size === 'md',
    'text-lg px-6 py-3 gap-3': props.size === 'lg',
    
    // Icon button
    'p-2': props.icon,
    
    // Rounded
    'rounded-md': !props.rounded && !props.icon,
    'rounded-full': props.rounded || props.icon,
    
    // Block
    'w-full': props.block,
    
    // States
    'opacity-75 cursor-not-allowed': props.disabled,
    'cursor-wait': props.loading
  };
});
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
  >
    <template v-if="loading">
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4"
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
    </template>
    <slot />
  </button>
</template>
