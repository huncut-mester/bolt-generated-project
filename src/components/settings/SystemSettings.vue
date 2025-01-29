<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { settingsApi } from '../../services/api';

const props = defineProps<{
  settings: any;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
}>();

const { t } = useI18n();
const saving = ref(false);
const formData = ref({
  sessionTimeout: props.settings?.sessionTimeout || 30,
  maxLoginAttempts: props.settings?.maxLoginAttempts || 5,
  passwordPolicy: {
    minLength: props.settings?.passwordPolicy?.minLength || 8,
    requireNumbers: props.settings?.passwordPolicy?.requireNumbers || true,
    requireSpecialChars: props.settings?.passwordPolicy?.requireSpecialChars || true,
    requireUppercase: props.settings?.passwordPolicy?.requireUppercase || true,
    passwordExpiration: props.settings?.passwordPolicy?.passwordExpiration || 90
  },
  mfaPolicy: {
    required: props.settings?.mfaPolicy?.required || false,
    requiredRoles: props.settings?.mfaPolicy?.requiredRoles || ['admin', 'super_admin']
  }
});

async function handleSubmit() {
  try {
    saving.value = true;
    await settingsApi.updateSettings(formData.value);
    emit('update');
  } catch (error) {
    console.error('Error updating settings:', error);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Session Settings -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ t('settings.session.title') }}
        </h3>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="sessionTimeout" class="block text-sm font-medium text-gray-700">
              {{ t('settings.session.timeout') }}
            </label>
            <div class="mt-1">
              <input
                type="number"
                id="sessionTimeout"
                v-model="formData.sessionTimeout"
                min="1"
                max="1440"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <p class="mt-2 text-sm text-gray-500">
              {{ t('settings.session.timeoutDescription') }}
            </p>
          </div>

          <div class="sm:col-span-3">
            <label for="maxLoginAttempts" class="block text-sm font-medium text-gray-700">
              {{ t('settings.session.maxAttempts') }}
            </label>
            <div class="mt-1">
              <input
                type="number"
                id="maxLoginAttempts"
                v-model="formData.maxLoginAttempts"
                min="1"
                max="10"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Policy -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ t('settings.password.title') }}
        </h3>
        <div class="mt-6 space-y-6">
          <div class="flex items-center">
            <input
              type="number"
              v-model="formData.passwordPolicy.minLength"
              min="8"
              max="32"
              class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <label class="ml-2 block text-sm font-medium text-gray-700">
              {{ t('settings.password.minLength') }}
            </label>
          </div>

          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex h-5 items-center">
                <input
                  type="checkbox"
                  v-model="formData.passwordPolicy.requireNumbers"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">
                  {{ t('settings.password.requireNumbers') }}
                </label>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex h-5 items-center">
                <input
                  type="checkbox"
                  v-model="formData.passwordPolicy.requireSpecialChars"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">
                  {{ t('settings.password.requireSpecialChars') }}
                </label>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex h-5 items-center">
                <input
                  type="checkbox"
                  v-model="formData.passwordPolicy.requireUppercase"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">
                  {{ t('settings.password.requireUppercase') }}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('settings.password.expiration') }}
            </label>
            <div class="mt-1">
              <input
                type="number"
                v-model="formData.passwordPolicy.passwordExpiration"
                min="0"
                max="365"
                class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <p class="mt-2 text-sm text-gray-500">
                {{ t('settings.password.expirationDescription') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MFA Policy -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ t('settings.mfa.title') }}
        </h3>
        <div class="mt-6 space-y-6">
          <div class="flex items-start">
            <div class="flex h-5 items-center">
              <input
                type="checkbox"
                v-model="formData.mfaPolicy.required"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <div class="ml-3 text-sm">
              <label class="font-medium text-gray-700">
                {{ t('settings.mfa.required') }}
              </label>
              <p class="text-gray-500">{{ t('settings.mfa.requiredDescription') }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ t('settings.mfa.requiredRoles') }}
            </label>
            <div class="mt-2 space-y-2">
              <div
                v-for="role in ['super_admin', 'admin', 'staff']"
                :key="role"
                class="flex items-start"
              >
                <div class="flex h-5 items-center">
                  <input
                    type="checkbox"
                    :value="role"
                    v-model="formData.mfaPolicy.requiredRoles"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label class="font-medium text-gray-700">
                    {{ t(`roles.${role}`) }}
                  </label>
                </div>
              </div>
            </div>
          </div>
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
