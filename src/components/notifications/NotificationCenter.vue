<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { TransitionGroup } from 'vue';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

const { t } = useI18n();
const notifications = ref<Notification[]>([]);
const showDrawer = ref(false);

function handleNotification(event: CustomEvent) {
  const notification: Notification = {
    id: crypto.randomUUID(),
    ...event.detail,
    timestamp: new Date(),
    read: false
  };
  
  notifications.value.unshift(notification);
  
  // Auto-remove after 5 seconds if not important
  if (notification.type !== 'error' && notification.type !== 'warning') {
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  }
}

function removeNotification(id: string) {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
}

function markAsRead(id: string) {
  const notification = notifications.value.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

function markAllAsRead() {
  notifications.value.forEach(n => n.read = true);
}

function clearAll() {
  notifications.value = [];
}

onMounted(() => {
  window.addEventListener('notification', handleNotification as EventListener);
});

onUnmounted(() => {
  window.removeEventListener('notification', handleNotification as EventListener);
});
</script>

<template>
  <div>
    <!-- Notification Bell -->
    <button
      @click="showDrawer = true"
      class="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <span class="sr-only">{{ t('notifications.view') }}</span>
      <BellIcon class="h-6 w-6" />
      <span
        v-if="notifications.filter(n => !n.read).length > 0"
        class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"
      />
    </button>

    <!-- Notification Drawer -->
    <TransitionRoot as="template" :show="showDrawer">
      <Dialog as="div" class="relative z-50" @close="showDrawer = false">
        <TransitionChild
          enter="ease-in-out duration-500"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="px-4 py-6 sm:px-6">
                      <div class="flex items-center justify-between">
                        <DialogTitle class="text-lg font-medium text-gray-900">
                          {{ t('notifications.title') }}
                        </DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            @click="showDrawer = false"
                          >
                            <span class="sr-only">{{ t('common.close') }}</span>
                            <XMarkIcon class="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                      <div class="mt-4 flex justify-between">
                        <button
                          @click="markAllAsRead"
                          class="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          {{ t('notifications.markAllRead') }}
                        </button>
                        <button
                          @click="clearAll"
                          class="text-sm text-gray-500 hover:text-gray-400"
                        >
                          {{ t('notifications.clearAll') }}
                        </button>
                      </div>
                    </div>
                    <div class="flex-1 divide-y divide-gray-200 overflow-y-auto">
                      <TransitionGroup
                        enter-active-class="transform transition duration-500 ease-out"
                        enter-from-class="translate-x-full opacity-0"
                        enter-to-class="translate-x-0 opacity-100"
                        leave-active-class="transform transition duration-500 ease-in"
                        leave-from-class="translate-x-0 opacity-100"
                        leave-to-class="translate-x-full opacity-0"
                      >
                        <div
                          v-for="notification in notifications"
                          :key="notification.id"
                          :class="[
                            'p-4',
                            notification.read ? 'bg-gray-50' : 'bg-white'
                          ]"
                        >
                          <div class="flex items-start">
                            <div class="flex-shrink-0">
                              <component
                                :is="notification.type === 'error' ? 'ExclamationCircleIcon' : 'InformationCircleIcon'"
                                :class="[
                                  'h-6 w-6',
                                  {
                                    'text-red-400': notification.type === 'error',
                                    'text-yellow-400': notification.type === 'warning',
                                    'text-green-400': notification.type === 'success',
                                    'text-blue-400': notification.type === 'info'
                                  }
                                ]"
                              />
                            </div>
                            <div class="ml-3 w-0 flex-1">
                              <p
                                :class="[
                                  'text-sm',
                                  notification.read ? 'text-gray-500' : 'text-gray-900'
                                ]"
                              >
                                {{ notification.message }}
                              </p>
                              <p class="mt-1 text-sm text-gray-500">
                                {{ new Date(notification.timestamp).toLocaleString() }}
                              </p>
                            </div>
                            <div class="ml-4 flex flex-shrink-0">
                              <button
                                @click="markAsRead(notification.id)"
                                class="inline-flex text-gray-400 hover:text-gray-500"
                              >
                                <span class="sr-only">{{ t('notifications.markRead') }}</span>
                                <CheckIcon class="h-5 w-5" />
                              </button>
                              <button
                                @click="removeNotification(notification.id)"
                                class="ml-2 inline-flex text-gray-400 hover:text-gray-500"
                              >
                                <span class="sr-only">{{ t('notifications.remove') }}</span>
                                <XMarkIcon class="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </TransitionGroup>

                      <div
                        v-if="notifications.length === 0"
                        class="p-4 text-center text-gray-500"
                      >
                        {{ t('notifications.empty') }}
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
