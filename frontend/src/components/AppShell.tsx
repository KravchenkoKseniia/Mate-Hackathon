import type { ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";

interface AppShellProps {
  children: ReactNode;
  stepIndicator?: ReactNode;
}

export default function AppShell({ children, stepIndicator }: AppShellProps) {
  return (
    <div className="min-h-screen w-full transition-colors duration-300" style={{ backgroundColor: "var(--color-bg)" }}>
      {/* Header */}
      <header className="w-full px-4 sm:px-8 py-6 lg:py-8">
        <div className="w-full max-w-5xl mx-auto px-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <img src="/logo-icon.svg" alt="" className="w-8 h-8" />
            <span className="text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap transition-colors" style={{ color: "var(--color-heading)", fontFamily: "Inter, sans-serif" }}>
              AdCreative Studio
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 xl:gap-8" style={{ fontFamily: "Inter, sans-serif" }}>
            <a href="#" className="text-base xl:text-lg font-semibold underline transition-colors" style={{ color: "var(--color-accent)" }}>Home</a>
            <a href="#" className="text-base xl:text-lg font-medium transition-colors" style={{ color: "var(--color-heading)" }}>Templates</a>
            <a href="#" className="text-base xl:text-lg font-medium whitespace-nowrap transition-colors" style={{ color: "var(--color-heading)" }}>My Creatives</a>
            <a href="#" className="text-base xl:text-lg font-medium transition-colors" style={{ color: "var(--color-heading)" }}>Pricing</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="w-full text-center px-4 sm:px-8 pt-4 lg:pt-8 pb-4 lg:pb-6 animate-fade-in">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <img src="/ai-assistant.png" alt="AI Assistant" className="w-14 h-14 lg:w-[68px] lg:h-[68px] object-cover" />
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm font-semibold text-center transition-colors" style={{ color: "var(--color-heading)" }}>AI Image Editor</p>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight text-center transition-colors" style={{ color: "var(--color-heading)" }}>
              AdCreative Studio edit your image for you
            </h2>
          </div>
        </div>
      </section>

      {/* Step indicator — centered with spacing */}
      {stepIndicator && (
        <div className="w-full px-4 sm:px-8 pt-2 pb-4">
          <div className="w-full max-w-5xl mx-auto flex justify-center">
            {stepIndicator}
          </div>
        </div>
      )}

      {/* Content — centered */}
      <section className="w-full px-4 sm:px-8 pt-4 lg:pt-6 pb-12 animate-fade-in">
        <div className="w-full max-w-5xl mx-auto px-2">
          {children}
        </div>
      </section>
    </div>
  );
}
