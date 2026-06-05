import { Link } from "@/lib/i18n/navigation";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Restaurant Name</h3>
            <p className="text-sm text-muted-foreground">
              Bringing you the finest dining experience with authentic flavors
              and exceptional service since 2010.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="footer-link">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/orders" className="footer-link">
                  Các món đã gọi
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/term-of-service" className="footer-link">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex justify-center sm:justify-start items-start">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Restaurant Street, Foodville, FC 12345
                </span>
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <Phone className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  (123) 456-7890
                </span>
              </li>
              <li className="flex justify-center sm:justify-start items-center">
                <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  info@restaurant.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {/* © {new Date().getFullYear()} Restaurant Name. All rights reserved. */}
          </p>
        </div>
      </div>
    </footer>
  );
}
