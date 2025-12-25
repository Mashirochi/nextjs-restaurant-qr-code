import DropdownAvatar from "@/components/custom/dropdown.avatar";
import MobileNavLinks from "@/components/custom/mobile.nav.links";
import NavLinks from "@/components/custom/nav.links";
import ModeToggle from "@/components/ui/mode-toggle";
import SwitchLanguage from "@/components/ui/switch-language";
import { routing } from "@/lib/i18n/routing";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavLinks />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileNavLinks />
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="flex justify-end">
              <SwitchLanguage />
              <ModeToggle />
            </div>
          </div>
          <DropdownAvatar />
        </header>
        {children}
      </div>
    </div>
  );
}
