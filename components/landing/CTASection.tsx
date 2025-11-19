'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-32 relative z-10 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-[#020817]/60 border border-slate-700/50 p-12 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl"
                >
                    {/* Glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" />

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                        Ready to Deploy?
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto drop-shadow-md">
                        The code won&apos;t write itself, and the team won&apos;t assemble by magic.
                        Light your beacon and start building today.
                    </p>

                    <Button asChild size="lg" className="bg-white text-black hover:bg-slate-200 font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            Start Your Journey <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
