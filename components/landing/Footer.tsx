'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const footerLinks = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'How it Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Showcase', href: '#showcase' },
    ],
    company: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact', href: '#contact' },
    ],
    legal: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' },
    ]
};

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-slate-800/50 bg-[#020817]/80 backdrop-blur-xl pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                                CodeCrew
                            </h3>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            The beacon for developers. Find your squad, build your dream projects, and ship to the world.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="https://github.com/Deta0ne" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="https://x.com/code_crew36616" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/mert-yildiz-60b519227" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-6">Stay Updated</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest project drops.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-full placeholder:text-slate-600"
                            />
                            <button className="bg-cyan-500 hover:bg-cyan-600 text-black p-2 rounded-lg transition-colors">
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} CodeCrew. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        {footerLinks.legal.map((link) => (
                            <Link key={link.label} href={link.href} className="hover:text-slate-300 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
}
