import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui-elements'

export default async function DashboardPage() {
    const widgets = await db.widget.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                <div>
                    <h1 className="heading-lg" style={{ marginBottom: 8 }}>Dashboard</h1>
                    <p style={{ color: 'var(--secondary)' }}>Manage your AI chat widgets</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Link href="/dashboard/settings">
                        <Button variant="secondary">
                            Settings
                        </Button>
                    </Link>
                    <Link href="/dashboard/create">
                        <Button variant="primary">
                            <Plus size={18} />
                            Create Widget
                        </Button>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {widgets.map(widget => (
                    <Link href={`/dashboard/${widget.id}`} key={widget.id}>
                        <div className="glass-panel" style={{ padding: 24, height: '100%', transition: 'transform 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: widget.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', color: 'white' }}>
                                    {widget.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="badge" style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12 }}>Active</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 8 }}>{widget.name}</h3>
                            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{widget.companyName}</p>
                        </div>
                    </Link>
                ))}

                {widgets.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 80, border: '1px dashed var(--surface-border)', borderRadius: 12 }}>
                        <h3 style={{ marginBottom: 16 }}>No widgets yet</h3>
                        <Link href="/dashboard/create">
                            <Button>Create your first widget</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
