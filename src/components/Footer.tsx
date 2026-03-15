import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F7F7F8] text-zinc-500 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/flowsight_sinfondo.png" alt="FlowSight Logo" width={32} height={32} className="w-8 h-8" />
              <span className="font-bold text-2xl tracking-tighter text-zinc-900">
                FlowSight
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Automatic task traceability powered by AI context understanding. Visibility without surveillance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-indigo-600 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-indigo-600 transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-zinc-400 hover:text-indigo-600 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold text-zinc-900 mb-6">Product</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#features" className="hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
              <li><Link href="/download" className="hover:text-indigo-600 transition-colors">Download</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 mb-6">Legal</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-indigo-600 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {currentYear} FlowSight Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}