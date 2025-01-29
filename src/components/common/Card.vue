<script setup lang="ts">
interface Props {
  hover?: boolean;
  glass?: boolean;
  bordered?: boolean;
  elevated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hover: false,
  glass: false,
  bordered: false,
  elevated: false
});
</script>

<template>
  <div
    :class="[
      'rounded-xl overflow-hidden',
      {
        'hover-scale': hover,
        'glass-effect': glass,
        'border border-gray-200': bordered,
        'shadow-lg': elevated,
        'bg-white': !glass
      }
    ]"
  >
    <slot />
  </div>
</template>
