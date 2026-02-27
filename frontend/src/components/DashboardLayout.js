import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ children, title, subtitle }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="main-area">
                <TopBar
                    title={title}
                    subtitle={subtitle}
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
