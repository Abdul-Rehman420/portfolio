'use client';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  IoGrid, IoCodeSlash, IoBarChart, IoServer, IoPeople, 
  IoBriefcase, IoBook, IoRibbon, IoLink, IoSettings, 
  IoLogOut, IoMenu, IoClose, IoArrowBack, IoFolder 
} from 'react-icons/io5';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: IoGrid },
  { label: 'Projects', href: '/admin/projects', icon: IoCodeSlash },
  { label: 'Categories', href: '/admin/categories', icon: IoFolder },
  { label: 'Skills', href: '/admin/skills', icon: IoBarChart },
  { label: 'Services', href: '/admin/services', icon: IoServer },
  { label: 'Testimonials', href: '/admin/testimonials', icon: IoPeople },
  { label: 'Experience', href: '/admin/experience', icon: IoBriefcase },
  { label: 'Education', href: '/admin/education', icon: IoBook },
  { label: 'Certifications', href: '/admin/certifications', icon: IoRibbon },
  { label: 'Social Links', href: '/admin/social-links', icon: IoLink },
  { label: 'Settings', href: '/admin/settings', icon: IoSettings },
];

export default function AdminLayout({ children }) {
  return <AuthProvider><AdminLayoutInner>{children}</AdminLayoutInner></AuthProvider>;
}

function AdminLayoutInner({ children }) {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="admin-theme min-h-screen bg-dark-bg flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-dark-card border-r border-white/10 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">Portfolio CMS</Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white cursor-pointer"><IoClose size={24} /></button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <button onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full cursor-pointer">
            <IoLogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 glass border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white cursor-pointer"><IoMenu size={24} /></button>
              <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors">
                <IoArrowBack /> View Site
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}