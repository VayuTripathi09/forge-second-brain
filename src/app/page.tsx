import Link from 'next/link';
import { ArrowRight, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      
      <main className="max-w-3xl w-full flex flex-col items-center text-center gap-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-blue-400 mb-4">
          <BrainCircuit size={16} />
          <span>Forge is now in public beta</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Your AI Second Brain for Building.
        </h1>
        
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
          Dump your chaotic project notes, brainstorms, and ideas. Forge structures them into clear execution plans in seconds.
        </p>
        
        <div className="flex gap-4 mt-8">
          <Link href="/dashboard" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2">
            Start Building <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    </div>
  );
}
