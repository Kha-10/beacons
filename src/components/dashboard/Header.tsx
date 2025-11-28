"use client";
import AccountSwitcher from "./AccountSwitcher";
import { Info } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <div className="w-full flex-1">
        <AccountSwitcher />
      </div>
      <div className="p-2 bg-accent text-accent-foreground/60 text-xs italic rounded flex items-center gap-2">
        <Info className="w-3 h-3 text-accent-foreground/60" />
        <p>Pages overview for the past 30 days</p>
      </div>
    </header>
  );
}
