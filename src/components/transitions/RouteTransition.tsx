"use client";

interface RouteTransitionProps {
  children: React.ReactNode;
  variant?: "theme" | "brand";
  duration?: number; // ms，默认 500
}

export function RouteTransition({
  children,
  variant = "theme",
  duration = 500,
}: RouteTransitionProps) {
  const animName = variant === "theme" ? "routeEnterTheme" : "routeEnterBrand";
  return (
    <div
      style={{
        animation: `${animName} ${duration}ms cubic-bezier(0.2,0.7,0.2,1) both`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

