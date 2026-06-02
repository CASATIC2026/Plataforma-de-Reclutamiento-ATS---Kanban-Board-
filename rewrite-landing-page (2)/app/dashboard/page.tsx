"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, getStoredUser, logout } from "@/lib/auth-mock";
import Link from "next/link";
import { LogOut, Bell, Settings } from "lucide-react";
import DashboardDesktop from "@/components/DashboardDesktop";
import DashboardMobile from "@/components/DashboardMobile";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      router.push("/auth/login");
      return;
    }
    setUser(storedUser);
    setLoading(false);

    // Check if mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050A14] flex items-center justify-center">
        <div className="text-on-surface-variant">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050A14] overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-outline-variant/10 bg-[#0F1B28] sticky top-0 z-40 overflow-hidden">
        <div className="max-w-full px-3 sm:px-4 md:px-8 py-4 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Link href="/dashboard" className="text-sm sm:text-lg md:text-xl font-bold text-slate-100 shrink-0">
            Talentify <span className="text-brand-turquoise">SV</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 flex-1">
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors text-sm whitespace-nowrap">
              Inicio
            </a>
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors text-sm whitespace-nowrap">
              Empresas
            </a>
            <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors text-sm whitespace-nowrap">
              Recursos
            </a>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
            <button className="p-1.5 sm:p-2 hover:bg-surface-container rounded-lg transition-colors flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-on-surface-variant" />
            </button>
            <button className="p-1.5 sm:p-2 hover:bg-surface-container rounded-lg transition-colors flex-shrink-0">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-on-surface-variant" />
            </button>
            
            <div className="hidden xs:flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-outline-variant/10 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-turquoise/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-bold text-brand-turquoise">
                  {user.avatar || user.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs sm:text-sm font-semibold text-slate-100 whitespace-nowrap">{user.name}</p>
                <p className="text-xs text-on-surface-variant whitespace-nowrap">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300 flex-shrink-0"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {isMobile ? (
          <DashboardMobile />
        ) : (
          <DashboardDesktop />
        )}
      </main>
    </div>
  );
}
