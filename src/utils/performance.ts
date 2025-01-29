interface PerformanceMetrics {
  pageLoad: number;
  apiResponse: number;
  renderTime: number;
  resourceLoad: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoad: 0,
    apiResponse: 0,
    renderTime: 0,
    resourceLoad: 0
  };

  private apiTimings: Map<string, number> = new Map();

  startApiCall(endpoint: string): void {
    this.apiTimings.set(endpoint, performance.now());
  }

  endApiCall(endpoint: string): void {
    const startTime = this.apiTimings.get(endpoint);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.apiResponse = (this.metrics.apiResponse + duration) / 2;
      this.apiTimings.delete(endpoint);
    }
  }

  measurePageLoad(): void {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      this.metrics.pageLoad = timing.loadEventEnd - timing.navigationStart;
      this.metrics.resourceLoad = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;
    }
  }

  startRenderMeasurement(): number {
    return performance.now();
  }

  endRenderMeasurement(startTime: number): void {
    const duration = performance.now() - startTime;
    this.metrics.renderTime = (this.metrics.renderTime + duration) / 2;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  reportMetrics(): void {
    // Send metrics to analytics service
    console.log('Performance Metrics:', this.metrics);
  }
}

export const performanceMonitor = new PerformanceMonitor();
