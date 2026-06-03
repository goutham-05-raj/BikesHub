import React, { useState, useEffect } from 'react';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatIST = (date) => {
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="live-clock-container">
            <div className="clock-label">LIVE SYSTEM TIME (IST)</div>
            <div className="clock-display">{formatIST(time)}</div>
            <style jsx="true">{`
                .live-clock-container {
                    background: rgba(15, 23, 42, 0.05);
                    border: 1px solid rgba(15, 23, 42, 0.1);
                    padding: 0.75rem 1.25rem;
                    border-radius: 14px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: center;
                    min-width: 280px;
                    backdrop-filter: blur(10px);
                }

                .clock-label {
                    font-size: 0.6rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    margin-bottom: 0.2rem;
                }

                .clock-display {
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                    font-size: 1.05rem;
                    font-weight: 500;
                    color: #f9a8d4;
                    letter-spacing: 0.02em;
                    text-shadow: 0 1px 4px rgba(249,168,212,0.3);
                }

                @media (max-width: 768px) {
                    .live-clock-container {
                        align-items: center;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default LiveClock;
