"use client";
import { useStore } from "@/store/useStore";
import { LayoutDashboard, Briefcase, CreditCard } from "lucide-react";

export default function Sidebar() {
  const credits = useStore((state) => state.credits);
  const user = useStore((state) => state.user);

  if (!user) {
    return <aside className="fixed left-0 top-0 h-full w-64 bg-[#00A86B] text-white p-6" />;
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#00A86B] text-white p-6 flex flex-col shadow-xl">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 text-lg font-bold">
          {user.avatarInitials}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold truncate">{user.name}</span>
          <span className="text-xs text-white/80 truncate">{user.email}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg cursor-pointer">
          <Briefcase size={20} />
          <span className="font-medium">Browse Jobs</span>
        </div>
        <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
          <LayoutDashboard size={20} />
          <span className="font-medium">Applications</span>
        </div>
      </nav>

      {/* Pro Upgrade & Credits Section */}
      <div className="mt-auto bg-white/10 p-4 rounded-xl border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard size={16} />
            <span className="text-sm font-medium">Credits</span>
          </div>
          <span className="text-sm font-bold">{credits}</span>
        </div>
        
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Pro Account</div>
          <p className="text-xs text-white/90 leading-relaxed">
            Get unlimited AI insights and direct sponsor contact.
          </p>
          <button className="w-full py-2.5 bg-white text-[#00A86B] rounded-lg text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-sm">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  );
}