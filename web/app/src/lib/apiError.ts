import axios from 'axios';

interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export interface ParsedApiError {
  message: string;
  fields: Record<string, string>;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;

    if (body?.error) {
      return { message: body.error.message, fields: body.error.fields ?? {} };
    }

    if (!error.response) {
      return { message: 'Cannot reach the server. Please try again.', fields: {} };
    }
  }

  return { message: 'Something went wrong. Please try again.', fields: {} };
}