import Link from 'next/link';
import { Bike, ArrowLeft } from 'lucide-react';

export default function NetworkNotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-torea-bay-50 p-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-torea-bay-100">
          <Bike className="h-8 w-8 text-torea-bay-400" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-torea-bay-800">Network not found</h1>

        <p className="mt-2 text-muted-foreground">
          The bike sharing network you&apos;re looking for doesn&apos;t exist or may have been
          removed.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-torea-bay-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-torea-bay-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all networks
        </Link>
      </div>
    </div>
  );
}
