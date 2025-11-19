'use client';

import { motion } from 'framer-motion';
import { Search, UserPlus, Code, Rocket } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "Discover Signals",
        description: "Browse active beacons from project leads looking for your specific skillset."
    },
    {
        icon: UserPlus,
        title: "Join the Crew",
        description: "Apply to projects that ignite your passion. Connect with like-minded developers."
    },
    {
        icon: Code,
        title: "Build Together",
        description: "Collaborate in real-time. Manage tasks, share code, and ship features."
    },
    {
        icon: Rocket,
        title: "Launch",
        description: "Deploy your project to the world and add a verified ship to your portfolio."
    }
];

export default function HowItWorksSection() {
    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                        The Protocol
                    </h2>
                    <p className="text-slate-300 text-lg drop-shadow-md">
                        From signal to launch in four simple steps.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#020817] border-2 border-cyan-500/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-xl relative group">
                                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md group-hover:blur-lg transition-all" />
                                    <step.icon className="w-8 h-8 text-cyan-400 relative z-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-[250px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
