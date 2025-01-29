<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useI18n } from 'vue-i18n';

const auth = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const email = ref('');
const password = ref('');
const mfaCode = ref('');
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  try {
    loading.value = true;
    error.value = '';

    if (auth.mfaRequired) {
      await auth.verifyMfa(mfaCode.value);
      router.push('/dashboard');
      return;
    }

    const result = await auth.login({
      email: email.value,
      password: password.value,
    });

    if (result.mfaRequired) {
      return;
    }

    router.push('/dashboard');
  } catch (e) {
    error.value = t('auth.loginError');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="/logo.svg" alt="Logo" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ t('auth.signIn') }}
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm -space-y-px">
          <template v-if="!auth.mfaRequired">
            <div>
              <label for="email-address" class="sr-only">{{ t('auth.email') }}</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                v-model="email"
                :class="[
                  'appearance-none rounded-none relative block w-full px-3 py-2 border',
                  'border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md',
                  'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                ]"
                :placeholder="t('auth.emailPlaceholder')"
              />
            </div>
            <div>
              <label for="password" class="sr-only">{{ t('auth.password') }}</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                v-model="password"
                :class="[
                  'appearance-none rounded-none relative block w-full px-3 py-2 border',
                  'border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md',
                  'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                ]"
                :placeholder="t('auth.passwordPlaceholder')"
              />
            </div>
          </template>

          <template v-else>
            <div>
              <label for="mfa-code" class="sr-only">{{ t('auth.mfaCode') }}</label>
              <input
                id="mfa-code"
                name="mfa-code"
                type="text"
                required
                v-model="mfaCode"
                :class="[
                  'appearance-none rounded-md relative block w-full px-3 py-2 border',
                  'border-gray-300 placeholder-gray-500 text-gray-900',
                  'focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                ]"
                :placeholder="t('auth.mfaCodePlaceholder')"
              />
            </div>
          </template>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              {{ t('auth.rememberMe') }}
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
              {{ t('auth.forgotPassword') }}
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            {{ auth.mfaRequired ? t('auth.verifyMfa') : t('auth.signIn') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
