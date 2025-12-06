import { createWidget } from '@/lib/actions'
import { Button, Input, Label } from '@/components/ui-elements'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateWidgetPage() {
    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
                <ArrowLeft size={16} />
                Back to Dashboard
            </Link>

            <h1 className="heading-lg" style={{ marginBottom: 32 }}>Create New Widget</h1>

            <form action={createWidget} className="glass-panel" style={{ padding: 32 }}>
                <div style={{ marginBottom: 24 }}>
                    <Label htmlFor="name">Bot Name</Label>
                    <Input name="name" id="name" placeholder="e.g. Support Bot" required />
                    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>This name will be displayed to users in the chat header.</p>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input name="companyName" id="companyName" placeholder="e.g. Acme Inc." />
                </div>

                <Button type="submit" style={{ width: '100%' }}>Create Widget</Button>
            </form>
        </div>
    )
}
