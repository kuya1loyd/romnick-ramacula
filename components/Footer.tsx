import Link from "next/link";
import { FileText } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 relative py-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-base font-extrabold tracking-wider text-slate-900 mb-1">
              GLIMPSE OF ROMNICK
            </span>
            <p className="text-xs text-slate-500 max-w-sm">
              Academic & Technology for Teaching and Learning Portfolio of{" "}
              <strong className="text-slate-800">Romnick P. Ramacula</strong> (BEEd-2C).
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="#home" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="#about" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="#advocacy" className="hover:text-slate-900 transition-colors">
              Advocacy
            </Link>
            <Link href="#video-reports" className="hover:text-slate-900 transition-colors">
              Video Reports
            </Link>
            <Link href="#my-tasks" className="hover:text-slate-900 transition-colors">
              My Tasks
            </Link>
          </div>
        </div>

        {/* Bottom Credits with static year 2026 to avoid Next.js prerender error */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 GLIMPSE OF ROMNICK. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span>Crafted for BEEd-2C Academic Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
