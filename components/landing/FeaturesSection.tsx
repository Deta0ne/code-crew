'use client';

import { motion } from 'framer-motion';
import { Users, Rocket, Shield, Zap, Globe, Code2 } from 'lucide-react';

const features = [
    {
        icon: Users,
        title: "Squad Assembly",
        description: "Find developers who match your stack and vibe. Build a balanced team ready to tackle any challenge."
    },
    {
        icon: Rocket,
        title: "Launch Pad",
        description: "From idea to MVP. We provide the structure and tools to help you ship your side projects."
    },
    {
        icon: Shield,
        title: "Verified Skills",
        description: "No more guessing. See verified portfolios and GitHub contributions before you recruit."
    },
    {
        icon: Zap,
        title: "Rapid Iteration",
        description: "Agile workflows built-in. Manage tasks, sprints, and milestones without the overhead."
    },
    {
        icon: Globe,
        title: "Global Network",
        description: "Connect with creators from around the world. Diversity drives innovation."
    },
    {
        icon: Code2,
        title: "Open Source First",
        description: "Built for the community. Support for open source licensing and contribution guidelines."
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                        Equipped for the Mission
                    </h2>
                    <p className="text-slate-300 text-lg drop-shadow-md">
                        Everything you need to turn a group of strangers into a high-performing product team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="group p-6 rounded-2xl bg-[#020817]/40 border border-slate-800/50 hover:border-cyan-500/50 transition-all hover:bg-[#020817]/60 backdrop-blur-md shadow-lg"
                        >
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
                                <feature.icon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
