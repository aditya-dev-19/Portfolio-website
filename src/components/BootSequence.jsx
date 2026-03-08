import React, { useState, useEffect } from 'react';

const bootLogs = [
    '[SYS] Initializing core modules...',
    '[OK] Memory allocation successful',
    '[SYS] Loading asset bundles...',
    '[WARN] Connection latency detected',
    '[OK] Establishing secure channel',
    '[SYS] Fetching project data...',
    '[OK] Dependencies resolved',
    '[SYS] Rendering user interface...',
    '[OK] Ready.'
];

export default function BootSequence({ isActive, onComplete }) {
    const [visibleLogs, setVisibleLogs] = useState([]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setVisibleLogs([]);
            setIsComplete(false);
            return;
        }

        let currentLog = 0;
        const interval = setInterval(() => {
            if (currentLog < bootLogs.length) {
                setVisibleLogs(prev => [...prev, bootLogs[currentLog]]);
                currentLog++;
            } else {
                setIsComplete(true);
                clearInterval(interval);
                if (onComplete) {
                    setTimeout(onComplete, 500); // small delay before opening modal
                }
            }
        }, 120); // Fast typing speed

        return () => clearInterval(interval);
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className={`absolute inset-0 bg-[#0a0c10]/95 backdrop-blur-sm z-30 p-4 font-mono text-[10px] sm:text-xs overflow-hidden transition-opacity duration-300 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="text-[var(--color-primary-green)] mb-2 animate-pulse">BOOT_SEQ_INIT</div>

            <div className="flex flex-col gap-1">
                {visibleLogs.map((log, index) => (
                    <div
                        key={index}
                        className={`${log && log.startsWith('[WARN]') ? 'text-yellow-500' : log && log.startsWith('[OK]') ? 'text-green-400' : 'text-gray-400'}`}
                    >
                        {log}
                    </div>
                ))}

                {!isComplete && (
                    <div className="w-2 h-4 bg-[var(--color-primary-green)] animate-pulse mt-1"></div>
                )}
            </div>

            <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
        </div>
    );
}
