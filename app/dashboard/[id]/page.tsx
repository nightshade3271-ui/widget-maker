import { db } from '@/lib/db'
import WidgetEditor from '@/components/WidgetEditor'
import { getWidgetStats } from '@/lib/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function WidgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const widget = await db.widget.findUnique({
        where: { id },
        include: { faqs: true }
    })

    if (!widget) notFound()

    const stats = await getWidgetStats(widget.id)

    return (
        <div>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
                <ArrowLeft size={16} />
                Back to Dashboard
            </Link>

            <WidgetEditor widget={widget} stats={stats} />
        </div>
    )
}
