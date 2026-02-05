'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NetworkDetailError({ error, reset }: ErrorProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-torea-bay-50 p-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-torea-bay-800">Failed to load network</h1>

        <p className="mt-2 text-muted-foreground">
          {error.message || "We couldn't load the network details. Please try again."}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-torea-bay-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-torea-bay-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-torea-bay-200 bg-white px-6 py-3 text-sm font-medium text-torea-bay-600 transition-colors hover:bg-torea-bay-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to networks
          </Link>
        </div>
      </div>
    </div>
  );
}
