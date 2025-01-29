<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const { t } = useI18n();

const timeRange = ref('month');
const loading = ref(true);
const analyticsData = ref({
  casesByType: {},
  casesByStatus: {},
  timelineData: [],
  processingTimes: {}
});

const lineChartData = computed(() => ({
  labels: analyticsData.value.timelineData.map(d => d.date),
  datasets: [
    {
      label: t('analytics.newCases'),
      data: analyticsData.value.timelineData.map(d => d.newCases),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)'
    },
    {
      label: t('analytics.completedCases'),
      data: analyticsData.value.timelineData.map(d => d.completedCases),
      borderColor: 'rgb(54, 162, 235)',
      tension: 0.1,
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)'
    }
  ]
}));

const barChartData = computed(() => ({
  labels: Object.keys(analyticsData.value.casesByType),
  datasets: [
    {
      label: t('analytics.casesByType'),
      data: Object.values(analyticsData.value.casesByType),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)'
      ]
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
};

async function fetchAnalyticsData() {
  try {
    loading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    analyticsData.value = {
      casesByType: {
        'residence_permit': 45,
        'work_permit': 30,
        'citizenship': 15,
        'family_reunion': 10
      },
      casesByStatus: {
        'new': 20,
        'in_progress': 35,
        'pending_docs': 15,
        'under_review': 20,
        'approved': 8,
        'rejected': 2
      },
      timelineData: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        newCases: Math.floor(Math.random() * 10),
        completedCases: Math.floor(Math.random() * 8)
      })),
      processingTimes: {
        'residence_permit': 45,
        'work_permit': 30,
        'citizenship': 90,
        'family_reunion': 60
      }
    };
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAnalyticsData);
</script>

<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ t('analytics.title') }}
        </h1>
        <div class="flex items-center space-x-4">
          <select
            v-model="timeRange"
            class="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="week">{{ t('analytics.lastWeek') }}</option>
            <option value="month">{{ t('analytics.lastMonth') }}</option>
            <option value="quarter">{{ t('analytics.lastQuarter') }}</option>
            <option value="year">{{ t('analytics.lastYear') }}</option>
          </select>
          <button
            @click="fetchAnalyticsData"
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            {{ t('analytics.refresh') }}
          </button>
        </div>
      </div>

      <div class="mt-8">
        <div v-if="loading" class="animate-pulse space-y-4">
          <div class="h-64 bg-gray-200 rounded"></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="h-64 bg-gray-200 rounded"></div>
            <div class="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>

        <template v-else>
          <!-- Case Timeline -->
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ t('analytics.caseTimeline') }}
            </h2>
            <div class="h-64">
              <Line
                :data="lineChartData"
                :options="chartOptions"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Cases by Type -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4">
                {{ t('analytics.casesByType') }}
              </h2>
              <div class="h-64">
                <Bar
                  :data="barChartData"
                  :options="chartOptions"
                />
              </div>
            </div>

            <!-- Processing Times -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium text-gray-900 mb-4">
                {{ t('analytics.processingTimes') }}
              </h2>
              <div class="space-y-4">
                <div
                  v-for="(days, type) in analyticsData.processingTimes"
                  :key="type"
                  class="relative pt-1"
                >
                  <div class="flex mb-2 items-center justify-between">
                    <div>
                      <span class="text-xs font-semibold inline-block text-indigo-600">
                        {{ t(`cases.type.${type}`) }}
                      </span>
                    </div>
                    <div class="text-right">
                      <span class="text-xs font-semibold inline-block text-indigo-600">
                        {{ days }} {{ t('analytics.days') }}
                      </span>
                    </div>
                  </div>
                  <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                    <div
                      :style="{ width: `${(days / 90) * 100}%` }"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
