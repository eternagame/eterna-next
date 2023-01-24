<template>
  <IAlert
    :color="color"
    :size="size"
    :dismissible="dismissible"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    {{ message }}
  </IAlert>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { IAlert } from '@inkline/inkline';

  type Color = 'danger' | 'info' | 'success' | 'warning';
  type Size = 'sm' | 'md' | 'lg';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  color: {
    type: String as PropType<Color>,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<Size>,
    required: true,
  },
  dismissible: Boolean,
});
</script>
