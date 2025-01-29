import { createApp } from 'vue';
import ErrorNotification from '../components/common/ErrorNotification.vue';

interface ErrorOptions {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  duration?: number;
}

class ErrorHandler {
  private static container: HTMLDivElement | null = null;

  private static createContainer() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'error-container';
      this.container.style.position = 'fixed';
      this.container.style.top = '1rem';
      this.container.style.right = '1rem';
      this.container.style.zIndex = '9999';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  static show(options: ErrorOptions) {
    const container = this.createContainer();
    const mount = document.createElement('div');
    container.appendChild(mount);

    const app = createApp(ErrorNotification, {
      ...options,
      onClose: () => {
        app.unmount();
        mount.remove();
      }
    });

    app.mount(mount);

    if (options.duration !== 0) {
      setTimeout(() => {
        app.unmount();
        mount.remove();
      }, options.duration || 5000);
    }
  }

  static handleError(error: any) {
    console.error('Application error:', error);

    if (error.response) {
      // Handle API errors
      const status = error.response.status;
      const message = error.response.data?.message || 'An error occurred';

      switch (status) {
        case 401:
          this.show({
            title: 'Authentication Error',
            message: 'Please log in again',
            type: 'error'
          });
          break;
        case 403:
          this.show({
            title: 'Access Denied',
            message: 'You do not have permission to perform this action',
            type: 'error'
          });
          break;
        case 404:
          this.show({
            title: 'Not Found',
            message: 'The requested resource was not found',
            type: 'warning'
          });
          break;
        case 422:
          this.show({
            title: 'Validation Error',
            message: message,
            type: 'warning'
          });
          break;
        default:
          this.show({
            title: 'Error',
            message: message,
            type: 'error'
          });
      }
    } else if (error.request) {
      // Handle network errors
      this.show({
        title: 'Network Error',
        message: 'Please check your internet connection',
        type: 'warning'
      });
    } else {
      // Handle other errors
      this.show({
        title: 'Application Error',
        message: error.message || 'An unexpected error occurred',
        type: 'error'
      });
    }
  }
}

export default ErrorHandler;
