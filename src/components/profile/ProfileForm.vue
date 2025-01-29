<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { userApi } from '../../services/api';

const props = defineProps<{
  profileData: any;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
}>();

const { t } = useI18n();
const saving = ref(false);
const formData = ref({ ...props.profileData });
const successMessage = ref('');
const errorMessage = ref('');

async function handleSubmit() {
  try {
    saving.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    await userApi.updateProfile(formData.value);
    successMessage.value = t('profile.updateSuccess');
    emit('update');
  } catch (error) {
    errorMessage.value = t('profile.updateError');
    console.error('Error updating profile:', error);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="successMessage" class="rounded-md bg-green-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <CheckCircleIcon class="h-5 w-5 text-green-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div class="sm:col-span-3">
        <label for="firstName" class="block text-sm font-medium text-gray-700">
          {{ t('profile.firstName') }}
        </label>
        <div class="mt-1">
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="sm:col-span-3">
        <label for="lastName" class="block text-sm font-medium text-gray-700">
          {{ t('profile.lastName') }}
        </label>
        <div class="mt-1">
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="sm:col-span-4">
        <label for="email" class="block text-sm font-medium text-gray-700">
          {{ t('profile.email') }}
        </label>
        <div class="mt-1">
          <input
            type="email"
            id="email"
            v-model="formData.email"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div class="sm:col-span-3">
        <label for="language" class="block text-sm font-medium text-gray-700">
          {{ t('profile.language') }}
        </label>
        <div class="mt-1">
          <select
            id="language"
            v-model="formData.language"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="hu">Magyar</option>
          </select>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        :disabled="saving"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {{ saving ? t('common.saving') : t('common.save') }}
      </button>
    </div>
  </form>
</template>
