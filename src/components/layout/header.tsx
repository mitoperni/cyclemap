import { Bike } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center gap-[8px] bg-white">
      <div className="flex items-center gap-2">
        <div className="flex h-[24px] w-[24px] items-center justify-center">
          <Bike className="text-grenadier-400" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-grenadier-400">CycleMap</h1>
      </div>
    </header>
  );
}
