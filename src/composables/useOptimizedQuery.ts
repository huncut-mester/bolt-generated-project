import { ref, onMounted, onUnmounted } from 'vue';
import { cacheManager } from '../utils/cache';
import { performanceMonitor } from '../utils/performance';

interface QueryOptions {
  cacheKey?: string;
  cacheDuration?: number;
  retryCount?: number;
  retryDelay?: number;
  onError?: (error: any) => void;
}

export function useOptimizedQuery<T>(
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const retryCount = ref(0);

  const {
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes
    retryCount: maxRetries = 3,
    retryDelay = 1000,
    onError
  } = options;

  async function fetchData() {
    if (cacheKey) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        data.value = cachedData;
        return;
      }
    }

    try {
      loading.value = true;
      error.value = null;

      if (cacheKey) {
        performanceMonitor.startApiCall(cacheKey);
      }

      const result = await queryFn();

      if (cacheKey) {
        performanceMonitor.endApiCall(cacheKey);
        cacheManager.set(cacheKey, result);
      }

      data.value = result;
    } catch (err: any) {
      error.value = err;
      
      if (retryCount.value < maxRetries) {
        retryCount.value++;
        setTimeout(fetchData, retryDelay * retryCount.value);
      } else {
        onError?.(err);
      }
    } finally {
      loading.value = false;
    }
  }

  function invalidateCache() {
    if (cacheKey) {
      cacheManager.remove(cacheKey);
    }
  }

  onMounted(() => {
    fetchData();
  });

  onUnmounted(() => {
    // Cleanup if needed
  });

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidateCache
  };
}
