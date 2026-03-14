"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, History, User } from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/dashboard", Icon: Home },
        { label: "Scan", href: "/scan", Icon: ScanLine },
        { label: "History", href: "/history", Icon: History },
        { label: "Profile", href: "/profile", Icon: User },
    ];

    return (
        <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 pb-6 px-4 z-50">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 ${isActive ? "text-black font-semibold" : "text-gray-500"
                            }`}
                    >
                        <item.Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
                        <span className="text-xs">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
