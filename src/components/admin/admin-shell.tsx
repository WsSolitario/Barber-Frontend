"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { httpClient } from "@/services/http-client";
import { useAuthStore } from "@/stores/auth-store";

const navigation = [
  { href: "/admin", label: "Resumen", icon: "01" },
  { href: "/admin/calendar", label: "Calendario", icon: "02" },
  { href: "/admin/reports", label: "Reportes", icon: "03" },
  { href: "/admin/users", label: "Equipo", icon: "04" },
  { href: "/admin/settings", label: "Configuracion", icon: "05" },
  { href: "/admin/media", label: "Fotos y cortes", icon: "06" },
];

export function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  const business = useQuery({ queryKey: ["business-settings"], enabled: Boolean(accessToken), queryFn: async () => (await httpClient.get<{ businessName?: string }>("/api/admin/settings", { headers: { Authorization: `Bearer ${accessToken}` } })).data });
  const businessName = business.data?.businessName ?? "BARBER OS";

  return (
    <div className="min-h-screen bg-[#f4f3ed] text-[#172b34]">
      <aside className="border-b border-[#35515a] bg-[#10242c] px-5 py-5 text-[#f4f3ed] lg:fixed lg:inset-y-0 lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <Link className="flex items-center gap-3" href="/admin">
          <span className="grid size-10 place-items-center bg-[#d6f22a] font-[family-name:var(--font-bebas-neue)] text-2xl text-[#10242c]">B</span>
          <span><strong className="block max-w-40 truncate text-sm tracking-wide">{businessName}</strong><small className="text-[#c8d2d2]">Panel administrativo</small></span>
        </Link>
        <nav aria-label="Navegacion administrativa" className="mt-6 grid grid-cols-3 gap-1.5 lg:mt-12 lg:block lg:space-y-2">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return <Link aria-current={active ? "page" : undefined} className={`flex min-h-12 flex-col justify-center gap-0.5 px-3 py-2 text-xs font-bold transition lg:flex-row lg:items-center lg:justify-start lg:gap-3 lg:py-3 lg:text-sm ${active ? "bg-[#d6f22a] text-[#10242c]" : "text-[#c8d2d2] hover:bg-[#1d3942] hover:text-[#f4f3ed]"}`} href={item.href} key={item.href}><span className="text-xs opacity-70">{item.icon}</span>{item.label}</Link>;
          })}
        </nav>
        <Link className="mt-6 hidden border border-[#5d7279] px-3 py-3 text-sm text-[#c8d2d2] hover:border-[#d6f22a] hover:text-[#d6f22a] lg:block" href="/">Ver sitio publico</Link>
      </aside>
      <main className="lg:ml-64">{children}</main>
    </div>
  );
}
