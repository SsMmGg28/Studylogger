"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LayoutDashboard, PlusCircle, History, Users, Settings, LogOut, Target, BarChart3, Timer, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/", label: "Dashboard", mobileLabel: "Ana Sayfa", icon: LayoutDashboard },
  { href: "/log", label: "Kayıt Ekle", mobileLabel: "Kayıt", icon: PlusCircle },
  { href: "/timer", label: "Zamanlayıcı", mobileLabel: "Süre", icon: Timer },
  { href: "/history", label: "Geçmiş", mobileLabel: "Geçmiş", icon: History },
  { href: "/goals", label: "Hedefler", mobileLabel: "Hedef", icon: Target },
  { href: "/stats", label: "İstatistik", mobileLabel: "İstat.", icon: BarChart3 },
  { href: "/friends", label: "Arkadaşlar", mobileLabel: "Arkadaş", icon: Users },
  { href: "/topics", label: "Kazanımlar", mobileLabel: "Konu", icon: Network },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  const initials = profile?.displayName
    ? profile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const userMenu = user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:ring-2 hover:ring-primary/30 transition-all">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-gradient-to-br from-primary/25 to-accent/25 text-primary text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{profile?.displayName}</p>
          <p className="text-xs text-muted-foreground">@{profile?.username}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            Ayarlar
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href="/auth/login">
      <Button size="sm">Giriş Yap</Button>
    </Link>
  );

  return (
    <>
      {/* ── Üst Navbar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 text-primary font-bold shrink-0 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[15px] tracking-tight">StudyLogger</span>
          </Link>

          {/* Nav Links — sadece md ve üstünde göster */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-primary/12 text-primary shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          {userMenu}
        </div>
      </header>

      {/* ── Alt Navigasyon — sadece mobilde göster ── */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/90 backdrop-blur-xl">
          <div className="flex items-center justify-around h-16 px-1">
            {navItems.map(({ href, mobileLabel, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 flex-1 h-full rounded-xl mx-0.5 transition-all duration-200",
                    active
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-6 rounded-full transition-all duration-200",
                    active && "bg-primary/15"
                  )}>
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <span className="text-[10px] font-medium leading-none">{mobileLabel}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
