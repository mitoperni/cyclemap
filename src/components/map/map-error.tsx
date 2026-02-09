'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface MapErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function MapError({ title = 'Map Error', message, onRetry }: MapErrorProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-torea-bay-50">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-lg bg-white p-6 text-center shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-torea-bay-900">{title}</h2>
          <p className="mt-1 text-sm text-torea-bay-600">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-md bg-torea-bay-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-torea-bay-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
