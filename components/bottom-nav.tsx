"use client";

import { useRouter, usePathname } from "next/navigation";
import { Home, Compass, User } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "/home", icon: Home, label: "home" },
    { href: "/explore", icon: Compass, label: "explore" },
    { href: "/profile", icon: User, label: "profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-6" />
                <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
