<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import StatCard from '../components/dashboard/StatCard.vue';
import RecentCases from '../components/cases/RecentCases.vue';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines.vue';
import ActivityFeed from '../components/dashboard/ActivityFeed.vue';

const { t } = useI18n();
const stats = ref({
  activeCases: 0,
  pendingDocuments: 0,
  upcomingDeadlines: 0,
  completedCases: 0
});

onMounted(async () => {
  // Fetch dashboard stats
  stats.value = {
    activeCases: 24,
    pendingDocuments: 12,
    upcomingDeadlines: 5,
    completedCases: 156
  };
});
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <h1 class="text-2xl font-semibold text-gray-900">{{ t('dashboard.overview') }}</h1>
    </div>
    
    <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <!-- Stats Grid -->
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          :title="t('dashboard.stats.activeCases')"
          :value="stats.activeCases"
          icon="DocumentTextIcon"
          trend="up"
          :trend-value="8"
        />
        <StatCard
          :title="t('dashboard.stats.pendingDocuments')"
          :value="stats.pendingDocuments"
          icon="ClockIcon"
          trend="down"
          :trend-value="3"
        />
        <StatCard
          :title="t('dashboard.stats.upcomingDeadlines')"
          :value="stats.upcomingDeadlines"
          icon="CalendarIcon"
          trend="up"
          :trend-value="2"
        />
        <StatCard
          :title="t('dashboard.stats.completedCases')"
          :value="stats.completedCases"
          icon="CheckCircleIcon"
          trend="up"
          :trend-value="12"
        />
      </div>

      <!-- Main 3 Column Grid -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Recent Cases -->
        <div class="lg:col-span-2">
          <RecentCases />
        </div>

        <!-- Activity Feed -->
        <div class="space-y-6">
          <UpcomingDeadlines />
          <ActivityFeed />
        </div>
      </div>
    </div>
  </div>
</template>
