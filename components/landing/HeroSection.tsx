'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Overlay Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="space-y-8 p-8 rounded-3xl bg-[#020817]/30 backdrop-blur-md border border-white/5 shadow-2xl"
                >
                    <div className="space-y-2">
                        <h2 className="text-cyan-400 font-medium tracking-widest text-sm uppercase mb-4">System Online</h2>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-lg">
                            Signal Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                                Next Adventure
                            </span>
                        </h1>
                    </div>

                    <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
                        The beacon is lit. Developers are calling. <br />
                        Find your crew, build your dream project, and ship it to the world.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 py-7 text-lg rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] border-0">
                            <Link href="/dashboard">
                                Answer the Call
                            </Link>
                        </Button>

                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-70"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex justify-center p-1 backdrop-blur-sm">
                    <div className="w-1 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                </div>
            </motion.div>
        </section>
    );
}
