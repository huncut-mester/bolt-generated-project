<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { userApi } from '../../services/api';
import QRCode from 'qrcode';

const props = defineProps<{
  mfaEnabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
}>();

const { t } = useI18n();
const showMfaSetup = ref(false);
const mfaCode = ref('');
const qrCodeUrl = ref('');
const mfaSecret = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);

async function setupMfa() {
  try {
    loading.value = true;
    const response = await userApi.updateMfa({ setup: true });
    mfaSecret.value = response.data.secret;
    const qrData = `otpauth://totp/ImmigrationDashboard:${response.data.email}?secret=${response.data.secret}&issuer=ImmigrationDashboard`;
    qrCodeUrl.value = await QRCode.toDataURL(qrData);
    showMfaSetup.value = true;
  } catch (error) {
    errorMessage.value = t('security.mfaSetupError');
  } finally {
    loading.value = false;
  }
}

async function verifyMfa() {
  try {
    loading.value = true;
    await userApi.updateMfa({
      setup: true,
      code: mfaCode.value,
      secret: mfaSecret.value
    });
    successMessage.value = t('security.mfaEnabled');
    showMfaSetup.value = false;
    emit('update');
  } catch (error) {
    errorMessage.value = t('security.mfaVerificationError');
  } finally {
    loading.value = false;
  }
}

async function disableMfa() {
  try {
    loading.value = true;
    await userApi.updateMfa({ enabled: false });
    successMessage.value = t('security.mfaDisabled');
    emit('update');
  } catch (error) {
    errorMessage.value = t('security.mfaDisableError');
  } finally {
    loading.value = false;
  }
}

async function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = t('security.passwordMismatch');
    return;
  }

  try {
    loading.value = true;
    await userApi.updatePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    });
    successMessage.value = t('security.passwordUpdated');
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    errorMessage.value = t('security.passwordUpdateError');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
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

    <!-- Password Change Section -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ t('security.changePassword') }}
        </h3>
        <div class="mt-6 space-y-6">
          <div>
            <label for="current-password" class="block text-sm font-medium text-gray-700">
              {{ t('security.currentPassword') }}
            </label>
            <div class="mt-1">
              <input
                type="password"
                id="current-password"
                v-model="currentPassword"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="new-password" class="block text-sm font-medium text-gray-700">
              {{ t('security.newPassword') }}
            </label>
            <div class="mt-1">
              <input
                type="password"
                id="new-password"
                v-model="newPassword"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">
              {{ t('security.confirmPassword') }}
            </label>
            <div class="mt-1">
              <input
                type="password"
                id="confirm-password"
                v-model="confirmPassword"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              @click="updatePassword"
              :disabled="loading"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {{ t('security.updatePassword') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MFA Section -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ t('security.twoFactorAuth') }}
        </h3>
        <div class="mt-2 max-w-xl text-sm text-gray-500">
          <p>{{ t('security.twoFactorDescription') }}</p>
        </div>
        <div class="mt-5">
          <template v-if="!mfaEnabled && !showMfaSetup">
            <button
              type="button"
              @click="setupMfa"
              :disabled="loading"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {{ t('security.enableMfa') }}
            </button>
          </template>

          <template v-if="showMfaSetup">
            <div class="mt-4 space-y-4">
              <div class="flex justify-center">
                <img :src="qrCodeUrl" alt="MFA QR Code" class="h-64 w-64" />
              </div>
              <div class="mt-4">
                <label for="mfa-code" class="block text-sm font-medium text-gray-700">
                  {{ t('security.enterMfaCode') }}
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    id="mfa-code"
                    v-model="mfaCode"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showMfaSetup = false"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {{ t('common.cancel') }}
                </button>
                <button
                  type="button"
                  @click="verifyMfa"
                  :disabled="loading"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {{ t('security.verifyMfa') }}
                </button>
              </div>
            </div>
          </template>

          <template v-if="mfaEnabled">
            <button
              type="button"
              @click="disableMfa"
              :disabled="loading"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {{ t('security.disableMfa') }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
