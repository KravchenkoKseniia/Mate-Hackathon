import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-[#2a2a2a] px-6 py-4">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Shot<span className="text-blue-500">Gen</span>
          </h1>
          <span className="text-sm text-neutral-500">
            AI Product Photography
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-6 py-8">{children}</main>
    </div>
  );
}
