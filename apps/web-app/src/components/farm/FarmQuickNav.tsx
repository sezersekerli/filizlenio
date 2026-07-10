"use client";

import { MobileSubNav } from "@/components/ui/MobileSubNav";
import { Banknote, CalendarCheck, ClipboardList, LayoutGrid, MessageCircle } from "lucide-react";

const links = [
  { href: "/farm", label: "Özet", icon: LayoutGrid, exact: true },
  { href: "/farm/isler", label: "İşler", icon: CalendarCheck },
  { href: "/farm/bildirimler", label: "Bildirim", icon: MessageCircle },
  { href: "/farm/masraflar", label: "Masraf", icon: Banknote },
  { href: "/farm/olaylar", label: "Olay", icon: ClipboardList },
] as const;

export function FarmQuickNav({ taskBadge }: { taskBadge?: number } = {}) {
  const items = links.map((link) =>
    link.href === "/farm/isler" && taskBadge != null && taskBadge > 0
      ? { ...link, badge: taskBadge }
      : link,
  );
  return <MobileSubNav items={items} />;
}
