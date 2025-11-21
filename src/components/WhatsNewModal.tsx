"use client";

import { X, Sparkles, User, Search, Code2, Menu, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsNewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WhatsNewModal({ isOpen, onClose }: WhatsNewModalProps) {
    if (!isOpen) return null;

    const features = [
        {
            icon: <User className="w-6 h-6" />,
            title: "Profile Search",
            description: "Search for any GitHub user and analyze their profile, projects, and contributions all in one place.",
            isNew: true,
        },
        {
            icon: <Code2 className="w-6 h-6" />,
            title: "Interactive Cards",
            description: "Seamlessly navigate between profiles and repositories with clickable cards - ask about projects and instantly explore them.",
            isNew: true,
        },
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "Smart Suggestions",
            description: "Get started quickly with AI-powered question suggestions tailored to profiles and repositories.",
            isNew: true,
        },
        {
            icon: <Menu className="w-6 h-6" />,
            title: "Mobile Responsive",
            description: "Full mobile support with hamburger menu for seamless browsing on any device.",
            isNew: true,
        },
        {
            icon: <FileCode className="w-6 h-6" />,
            title: "File Preview",
            description: "Double-click any file in the repository sidebar to instantly preview its contents with syntax highlighting.",
            isNew: true,
        },
        {
            icon: <Search className="w-6 h-6" />,
            title: "Enhanced Navigation",
            description: "Back buttons, improved error pages, and streamlined UX throughout the app.",
            isNew: false,
        },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[85vh] bg-zinc-900 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/10 to-blue-600/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">What's New</h2>
                                <p className="text-sm text-zinc-400">Latest features and improvements</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-400 hover:text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-4 p-4 bg-zinc-800/50 border border-white/5 rounded-lg hover:border-purple-600/30 transition-all"
                            >
                                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg text-white shrink-0">
                                    {feature.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                        {feature.isNew && (
                                            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-600 text-white rounded-full">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-400">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 bg-zinc-900/80 backdrop-blur-sm text-center">
                        <p className="text-sm text-zinc-500">
                            More features coming soon! Stay tuned 🚀
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
