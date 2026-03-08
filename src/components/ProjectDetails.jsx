import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Terminal, FolderOpen } from 'lucide-react';

export default function ProjectDetails({ project, onClose }) {
    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (!project) return;

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Handle Escape key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [project, onClose]);

    if (!project) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a0a0a] border border-[var(--color-primary-green)]/30 rounded-lg overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,255,136,0.1)] animate-in slide-in-from-bottom-8 duration-500">

                {/* Mock Title Bar */}
                <div className="h-10 bg-[#12141c] border-b border-[var(--color-primary-green)]/30 flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer transition-colors" onClick={onClose} title="Close"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>

                    <div className="font-mono text-[10px] text-gray-500 flex items-center gap-2">
                        <FolderOpen className="w-3 h-3" />
                        <span>~/projects/{project.title.toLowerCase().replace(/\s+/g, '-')}</span>
                    </div>

                    <div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Scrollable Area */}
                <div className="overflow-y-auto overflow-x-hidden hide-scrollbar flex-1 relative bg-[#0a0a0a]">
                    <div className="absolute inset-0 scanline pointer-events-none opacity-20 hidden md:block"></div>

                    <div className="p-6 md:p-10 text-[var(--color-text-body)]">

                        {/* Header & Image */}
                        <div className="mb-10 group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary-green)]/20 to-transparent blur-sm opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative ring-1 ring-[var(--color-primary-green)]/30 bg-[#10121a] overflow-hidden rounded-sm">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-64 md:h-96 object-cover object-center filter grayscale-[0.2] sepia-[0.1] contrast-125 hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                                {/* Status Overlay */}
                                <div className="absolute top-4 right-4 bg-black/80 px-3 py-1.5 font-mono text-[10px] text-[var(--color-primary-green)] border border-[var(--color-primary-green)]/50 backdrop-blur-md">
                                    <span className="animate-pulse mr-2">●</span>
                                    DEPLOYED_STATUS: ACTIVE
                                </div>
                            </div>
                        </div>

                        {/* Project Info Layout */}
                        <div className="grid md:grid-cols-3 gap-10">

                            {/* Main Details (Col Span 2) */}
                            <div className="md:col-span-2 space-y-8 relative z-10">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-mono text-white tracking-widest uppercase mb-4 text-glow flex items-center">
                                        <Terminal className="w-8 h-8 mr-4 text-[var(--color-primary-green)] hidden sm:block" />
                                        {project.title}
                                    </h2>

                                    {/* Terminal-style description block */}
                                    <div className="font-mono text-sm leading-relaxed text-gray-300 bg-[var(--color-bg-dark)] border-l-2 border-[var(--color-primary-green)]/50 p-4 pl-6 relative before:content-['>_cat_README.md'] before:absolute before:-top-3 before:left-4 before:bg-[#0a0a0a] before:px-2 before:text-[10px] before:text-[var(--color-primary-green)]">
                                        <p className="mb-4">{project.description}</p>
                                        <p className="text-gray-400">
                                            Built with scalability and performance in mind. This project showcases brutalist design principles applied to modern web infrastructure, focusing on speed, accessible keyboard navigation, and stark aesthetic contrast.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar / Meta Information */}
                            <div className="space-y-8 mt-10 md:mt-0 relative z-10">

                                {/* Technologies */}
                                <div>
                                    <div className="font-mono text-xs text-gray-500 mb-3 uppercase tracking-widest border-b border-gray-800 pb-2">
                                        // Tech_Stack
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map(t => (
                                            <span key={t} className="px-3 py-1 font-mono text-[10px] text-[var(--color-primary-green)] bg-[var(--color-primary-green)]/10 border border-[var(--color-primary-green)]/20">
                                                [{t.toLowerCase()}]
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div>
                                    <div className="font-mono text-xs text-gray-500 mb-3 uppercase tracking-widest border-b border-gray-800 pb-2">
                                        // System_Commands
                                    </div>
                                    <div className="flex flex-col gap-3 font-mono text-sm">
                                        <a
                                            href={(project.github && project.github !== '#') ? project.github : '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center justify-between px-4 py-3 bg-[#111] hover:bg-[var(--color-primary-green)] hover:text-black border border-gray-800 hover:border-[var(--color-primary-green)] transition-all cursor-pointer"
                                        >
                                            <span className="flex items-center">
                                                <span className="text-[var(--color-primary-green)] group-hover:text-black mr-2">&gt;</span>
                                                git clone
                                            </span>
                                            <Github className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all" />
                                        </a>

                                        <a
                                            href={(project.live && project.live !== '#') ? project.live : '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center justify-between px-4 py-3 bg-[#111] hover:bg-[var(--color-primary-green)] hover:text-black border border-gray-800 hover:border-[var(--color-primary-green)] transition-all cursor-pointer"
                                        >
                                            <span className="flex items-center">
                                                <span className="text-[var(--color-primary-green)] group-hover:text-black mr-2">&gt;</span>
                                                npm start
                                            </span>
                                            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
