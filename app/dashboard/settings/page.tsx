import { getSystemSettings, updateSystemSettings } from '@/lib/actions'
import { Button, Input, Label } from '@/components/ui-elements'
import { ArrowLeft, Settings as SettingsIcon, BarChart } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
    const settings = await getSystemSettings()

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--secondary)', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>

            <h1 className="heading-lg" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                <SettingsIcon size={32} />
                Global Settings
            </h1>

            <form action={updateSystemSettings}>
                <div className="glass-panel" style={{ padding: 32, marginBottom: 32 }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                        AI Configuration
                    </h2>

                    <div style={{ marginBottom: 24 }}>
                        <Label htmlFor="openRouterKey">OpenRouter API Key</Label>
                        <Input
                            name="openRouterKey"
                            id="openRouterKey"
                            type="password"
                            placeholder="sk-or-..."
                            defaultValue={settings.openRouterKey || ''}
                        // required // Optional, maybe they want to clear it
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>
                            Required for AI responses. Get your key from <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>OpenRouter</a>.
                        </p>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <Label htmlFor="defaultModel">Default AI Model</Label>
                        <Input
                            name="defaultModel"
                            id="defaultModel"
                            placeholder="e.g. google/gemini-2.0-flash-001"
                            defaultValue={settings.defaultModel}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>
                            The default model ID to use for new widgets.
                        </p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: 32, marginBottom: 32 }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BarChart size={24} />
                        Analytics Settings
                    </h2>
                    <p style={{ color: 'var(--secondary)', marginBottom: 16 }}>
                        Configure how data is collected and processed.
                    </p>
                    {/* Placeholder for future analytics settings */}
                    <div style={{ opacity: 0.5 }}>
                        <div style={{ marginBottom: 16 }}>
                            <Label>Data Retention (Days)</Label>
                            <Input disabled value="30" />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Analytics configuration is coming soon.</p>
                    </div>
                </div>

                <Button type="submit" style={{ minWidth: 150 }}>
                    Save Changes
                </Button>
            </form>
        </div>
    )
}
