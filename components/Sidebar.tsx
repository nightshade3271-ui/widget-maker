import Link from 'next/link'
import { Rocket, Layout, Settings } from 'lucide-react'

export function Sidebar() {
    return (
        <aside style={{ width: 250, borderRight: '1px solid var(--surface-border)', height: '100vh', position: 'fixed', left: 0, top: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Rocket size={20} color="white" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>WidgetMaker</span>
            </div>

            <nav style={{ padding: '0 12px' }}>
                <SidebarItem href="/dashboard" icon={<Layout size={18} />} label="My Widgets" />
                <SidebarItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
            </nav>
        </aside>
    )
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            color: '#94a3b8',
            borderRadius: 8,
            transition: 'all 0.2s',
            marginBottom: 4
        }}>
            {icon}
            <span>{label}</span>
        </Link>
    )
}
