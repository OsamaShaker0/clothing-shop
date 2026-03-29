export interface ResponseStructureInterface<T = any> {
  apiVersion: string;
  status: 'success' | 'error';
  message: string;
  data?: T | null;
  error?: any;
}
