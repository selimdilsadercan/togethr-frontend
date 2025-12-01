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

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/home" && pathname?.startsWith(href)) ||
    (href === "/home" && pathname === "/");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-white/30 z-30">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-around py-3 font-['Galindo']">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                aria-label={item.label}
                className={`flex flex-col items-center gap-1 transition ${
                  active
                    ? "text-[#4a00c9]"
                    : "text-gray-500 hover:text-[#4a00c9]"
                }`}
              >
                <Icon className="size-6" />
                <span className={`text-xs ${active ? "font-semibold" : "font-normal"}`}>
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
