import type { ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
      <header
        className="sticky top-0 z-40 border-b px-6 py-4"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div className="mx-auto max-w-[1280px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 2C10.686 2 7.5 3.318 5.222 5.222C2.944 7.126 2 10.686 2 14v2c0 1.056.43 2.07.886 2.852.462.798 1.018 1.466 1.406 1.856L7.126 23.54 8.28 27h9.44l1.154-3.46 2.834-2.832c.388-.39.944-1.06 1.406-1.856C23.57 18.07 24 17.056 24 16v-2c0-2.917-1.159-5.715-3.222-7.778C18.715 4.159 15.917 3 13 3"
                fill="var(--color-accent)"
              />
              <rect x="10" y="24" width="8" height="2" rx="1" fill="var(--color-accent)" />
            </svg>
            <h1
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--color-heading)" }}
            >
              AdCreative
            </h1>
            <span
              className="text-lg font-light tracking-tight"
              style={{ color: "var(--color-heading)" }}
            >
              ShotGen
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
              }}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                border: "2px solid var(--color-secondary)",
                color: "var(--color-accent-text)",
                backgroundColor: "transparent",
              }}
            >
              About
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-6 py-10">{children}</main>
    </div>
  );
}
