'use client';

import { motion } from 'framer-motion';

const stats = [
    { value: "500+", label: "Active Beacons" },
    { value: "2.4k", label: "Developers Deployed" },
    { value: "150+", label: "Projects Shipped" },
    { value: "98%", label: "Crew Satisfaction" }
];

export default function StatsSection() {
    return (
        <section className="py-20 relative z-10 border-y border-white/5 bg-[#020817]/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                {stat.value}
                            </h3>
                            <p className="text-cyan-400 font-medium tracking-wider text-sm uppercase">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
