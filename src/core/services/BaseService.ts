// Abstract base service following Single Responsibility and Open/Closed Principles
export abstract class BaseService<T extends { id: string | number }> {
  protected abstract endpoint: string;

  constructor(protected api: any) {}

  async getAll(): Promise<T[]> {
    const response = await this.api.get(this.endpoint);
    return response.data;
  }

  async getById(id: string | number): Promise<T> {
    const response = await this.api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await this.api.post(this.endpoint, data);
    return response.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response = await this.api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    await this.api.delete(`${this.endpoint}/${id}`);
  }

  protected handleError(error: any): never {
    // Common error handling logic
    throw error;
  }
}
