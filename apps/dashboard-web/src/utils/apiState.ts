import { ApiClientError } from '../services/apiClient';

export const PERMISSION_DENIED_PATTERN = /403|forbidden|permission denied|unauthor(?:i[sz]ed)/i;

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isPermissionDenied(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    if (error.status === 401 || error.status === 403) return true;
    if (error.message && PERMISSION_DENIED_PATTERN.test(error.message)) return true;
    return false;
  }
  if (error instanceof Error) {
    return PERMISSION_DENIED_PATTERN.test(error.message);
  }
  return false;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
