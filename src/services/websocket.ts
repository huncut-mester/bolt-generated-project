import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  
  public connected = ref(false);
  public lastMessage = ref<any>(null);

  constructor(private baseUrl: string) {}

  connect() {
    const auth = useAuthStore();
    if (!auth.token) return;

    try {
      this.socket = new WebSocket(`${this.baseUrl}?token=${auth.token}`);
      
      this.socket.onopen = () => {
        this.connected.value = true;
        this.reconnectAttempts = 0;
        console.log('WebSocket connected');
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.lastMessage.value = data;
        this.handleMessage(data);
      };

      this.socket.onclose = () => {
        this.connected.value = false;
        this.handleReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.socket?.close();
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case 'notification':
        this.handleNotification(data.payload);
        break;
      case 'case_update':
        this.handleCaseUpdate(data.payload);
        break;
      case 'document_update':
        this.handleDocumentUpdate(data.payload);
        break;
    }
  }

  private handleNotification(payload: any) {
    const event = new CustomEvent('notification', { detail: payload });
    window.dispatchEvent(event);
  }

  private handleCaseUpdate(payload: any) {
    const event = new CustomEvent('case_update', { detail: payload });
    window.dispatchEvent(event);
  }

  private handleDocumentUpdate(payload: any) {
    const event = new CustomEvent('document_update', { detail: payload });
    window.dispatchEvent(event);
  }

  send(type: string, payload: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService('ws://localhost:3000/ws');
