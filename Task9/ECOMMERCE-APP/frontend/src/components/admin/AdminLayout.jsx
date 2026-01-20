import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {

    const user = localStorage.getItem("user");

    console.log("---> ", user.token);

    return (
        <div className="flex bg-warm-cream min-h-screen font-sans">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Optional: Admin Topbar could go here */}

                {/* Background pattern for the content area */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none z-0"></div>

                <div className="flex-1 overflow-y-auto p-4 pt-24 md:p-8 relative z-10 scrollbar-thin scrollbar-thumb-indigo-dye/20 scrollbar-track-transparent">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
