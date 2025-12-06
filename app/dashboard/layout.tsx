import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div style={{ paddingLeft: 250, minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ padding: 40 }}>
                {children}
            </main>
        </div>
    )
}
