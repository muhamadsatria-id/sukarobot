import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col font-sans bg-[#f0f9ff] text-ink selection:bg-[#3c83f6] selection:text-white">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}