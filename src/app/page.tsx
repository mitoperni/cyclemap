import { fetchNetworks } from '@/lib/api/networks';

export default async function Home() {
  const networks = await fetchNetworks();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-torea-bay-700">CycleMap</h1>
        <p className="mt-2 text-zinc-500">
          Explore bicycle sharing networks around the world
        </p>
        <p className="mt-4 text-sm text-zinc-400">
          API Test: Found {networks.length} networks
        </p>
      </div>
    </main>
  );
}
