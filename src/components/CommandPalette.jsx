import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ArrowRight, User, FolderGit2, Briefcase, Mail } from 'lucide-react';

const commands = [
    { id: 'about', title: 'Go to About', icon: User, action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'projects', title: 'Go to Projects', icon: FolderGit2, action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'experience', title: 'Go to Experience', icon: Briefcase, action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'contact', title: 'Go to Contact', icon: Mail, action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'github', title: 'Open GitHub', icon: Terminal, action: () => window.open('https://github.com/aditya-dev-19', '_blank') },
    { id: 'linkedin', title: 'Open LinkedIn', icon: Terminal, action: () => window.open('https://www.linkedin.com/in/aditya-dev19', '_blank') },
    { id: 'docs', title: 'Download Resume [PDF]', icon: Terminal, action: () => window.open('/resume.pdf', '_blank') },
];

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Filter commands based on search query
    const filteredCommands = query === ''
        ? commands
        : commands.filter((cmd) => cmd.title.toLowerCase().includes(query.toLowerCase()));

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Toggle palette on Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }

            // Close on Escape
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle keyboard navigation within the palette
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
            return;
        }

        inputRef.current?.focus();

        const handlePaletteNavigation = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('keydown', handlePaletteNavigation);
        return () => window.removeEventListener('keydown', handlePaletteNavigation);
    }, [isOpen, filteredCommands, selectedIndex]);

    // Reset index when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[25vh]">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Palette Window */}
            <div className="relative w-full max-w-xl mx-4 bg-[#0A0C10] border border-[var(--color-border-glow)] shadow-[0_0_40px_rgba(0,255,136,0.1)] rounded-sm overflow-hidden transform transition-all">

                {/* Terminal Header */}
                <div className="bg-[#10121a] border-b border-[var(--color-border-glow)] px-4 py-2 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-[var(--color-primary-green)]/80"></div>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase">system_prompt</span>
                </div>

                {/* Input Area */}
                <div className="p-4 flex items-center border-b border-[var(--color-border-glow)]">
                    <span className="text-[var(--color-primary-green)] mr-3 font-mono font-bold">~{'>'}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full bg-transparent border-none outline-none text-white font-mono placeholder:text-gray-600"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Commands List */}
                <div className="max-h-[60vh] overflow-y-auto py-2 px-2 scrollbar-thin">
                    {filteredCommands.length === 0 ? (
                        <div className="p-4 text-center text-sm font-mono text-gray-500">
                            No commands found for "{query}"
                        </div>
                    ) : (
                        filteredCommands.map((command, index) => {
                            const active = index === selectedIndex;
                            const Icon = command.icon;

                            return (
                                <div
                                    key={command.id}
                                    className={`flex items-center justify-between p-3 cursor-pointer font-mono text-sm transition-colors ${active
                                        ? 'bg-[var(--color-primary-green)]/10 text-white border-l-2 border-[var(--color-primary-green)]'
                                        : 'text-gray-400 hover:bg-white/5 border-l-2 border-transparent'
                                        }`}
                                    onClick={() => {
                                        command.action();
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${active ? 'text-[var(--color-primary-green)]' : 'text-gray-500'}`} />
                                        <span>{command.title}</span>
                                    </div>
                                    {active && <ArrowRight className="w-4 h-4 text-[var(--color-primary-green)] animate-pulse" />}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="bg-[#0A0C10] border-t border-[var(--color-border-glow)] px-4 py-2 flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <div className="flex items-center gap-4">
                        <span><kbd className="bg-white/10 px-1 py-0.5 rounded mr-1">↑↓</kbd> navigate</span>
                        <span><kbd className="bg-white/10 px-1 py-0.5 rounded mr-1">↵</kbd> select</span>
                        <span><kbd className="bg-white/10 px-1 py-0.5 rounded mr-1">esc</kbd> close</span>
                    </div>
                    <span className="text-[var(--color-primary-green)]/50">V 1.0.0</span>
                </div>
            </div>
        </div>
    );
}
