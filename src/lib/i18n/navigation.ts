import { createNavigation } from "next-intl/navigation";
import { locales } from "@/lib/validateEnv";

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation({ locales });
