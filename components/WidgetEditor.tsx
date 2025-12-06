'use client'

import React, { useState } from 'react'
import { Button, Input, Label, Textarea } from '@/components/ui-elements'
import { updateWidget, createFAQ, deleteFAQ } from '@/lib/actions'
import { Widget, FAQ } from '@prisma/client'
import { Save, MessageSquare, Code, Settings, Trash2, BarChart } from 'lucide-react'
import clsx from 'clsx'

export default function WidgetEditor({ widget, stats }: { widget: Widget & { faqs: FAQ[] }, stats: any }) {
    const [activeTab, setActiveTab] = useState<'settings' | 'faq' | 'embed' | 'analytics'>('settings')

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                    <h1 className="heading-lg">{widget.name}</h1>
                    <p style={{ color: 'var(--secondary)' }}>{widget.companyName}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, background: 'var(--surface)', padding: 4, borderRadius: 12, border: '1px solid var(--surface-border)' }}>
                    <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={16} />} label="Settings" />
                    <TabButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} icon={<MessageSquare size={16} />} label="Knowledge Base" />
                    <TabButton active={activeTab === 'embed'} onClick={() => setActiveTab('embed')} icon={<Code size={16} />} label="Install" />
                    <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart size={16} />} label="Analytics" />
                </div>
            </div>

            <div className="grid-cols-2" style={{ alignItems: 'start' }}>
                <div>
                    {activeTab === 'settings' && <SettingsForm widget={widget} />}
                    {activeTab === 'faq' && <FAQManager widgetId={widget.id} faqs={widget.faqs} />}
                    {activeTab === 'embed' && <EmbedCode widgetId={widget.id} />}
                    {activeTab === 'analytics' && <AnalyticsView stats={stats} />}
                </div>

                {/* Live Preview */}
                <div style={{ position: 'sticky', top: 40 }}>
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Live Preview</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Updates on save</span>
                    </div>

                    <div style={{ background: 'white', borderRadius: 16, height: 600, position: 'relative', overflow: 'hidden', boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)' }}>
                        {/* Header */}
                        <div style={{ background: widget.primaryColor, padding: 16, color: 'white' }}>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{widget.name}</div>
                            <div style={{ fontSize: 12, opacity: 0.8 }}>by {widget.companyName}</div>
                        </div>

                        {/* Messages */}
                        <div style={{ padding: 16, height: 'calc(100% - 130px)', background: '#f8fafc', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: widget.primaryColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>AI</div>
                                <div style={{ background: 'white', padding: '12px 16px', borderRadius: '0 12px 12px 12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', maxWidth: '85%', color: '#334155', fontSize: 14 }}>
                                    {widget.welcomeMessage}
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, background: 'white', borderTop: '1px solid #e2e8f0' }}>
                            <input disabled placeholder="Type a message..." style={{ width: '100%', padding: 12, borderRadius: 24, border: '1px solid #e2e8f0', background: '#f1f5f9' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8,
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: active ? 'white' : 'var(--secondary)',
                fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}


function SettingsForm({ widget }: { widget: any }) {
    return (
        <form action={updateWidget.bind(null, widget.id)} className="glass-panel fade-in" style={{ padding: 24 }}>
            <input type="hidden" name="id" value={widget.id} />

            <div style={{ marginBottom: 20 }}>
                <Label>Bot Name</Label>
                <Input name="name" defaultValue={widget.name} />
            </div>

            <div style={{ marginBottom: 20 }}>
                <Label>Company Name</Label>
                <Input name="companyName" defaultValue={widget.companyName} />
            </div>

            <div style={{ marginBottom: 20 }}>
                <Label>Welcome Message</Label>
                <Textarea name="welcomeMessage" className="input" rows={3} defaultValue={widget.welcomeMessage} />
            </div>

            <div style={{ marginBottom: 20 }}>
                <Label>System Prompt (Personality)</Label>
                <Textarea name="systemPrompt" className="input" rows={5} defaultValue={widget.systemPrompt} />
                <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginTop: 8 }}>Define how the AI should behave.</p>
            </div>

            <div className="grid-cols-2" style={{ marginBottom: 24 }}>
                <div>
                    <Label>Primary Color</Label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Input type="color" name="primaryColor" defaultValue={widget.primaryColor} style={{ width: 50, padding: 2, height: 40 }} />
                        <Input name="primaryColor" defaultValue={widget.primaryColor} />
                    </div>
                </div>
                <div>
                    <Label>Secondary Color</Label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Input type="color" name="secondaryColor" defaultValue={widget.secondaryColor} style={{ width: 50, padding: 2, height: 40 }} />
                        <Input name="secondaryColor" defaultValue={widget.secondaryColor} />
                    </div>
                </div>
            </div>

            <Button type="submit">
                <Save size={16} /> Save Changes
            </Button>
        </form>
    )
}

function FAQManager({ widgetId, faqs }: { widgetId: string, faqs: any[] }) {
    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Add New FAQ</h3>
                <form action={createFAQ.bind(null, widgetId)} style={{ display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12 }}>
                    <Input name="question" placeholder="Question (e.g. What are your hours?)" required />
                    <Textarea name="answer" placeholder="Answer" className="input" rows={2} required />
                    <Button type="submit" variant="secondary" style={{ alignSelf: 'flex-start' }}>Add FAQ</Button>
                </form>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Existing FAQs ({faqs.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {faqs.map(faq => (
                    <div key={faq.id} style={{ padding: 16, border: '1px solid var(--surface-border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'start', background: 'rgba(255,255,255,0.02)' }}>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: 4, color: '#e2e8f0' }}>{faq.question}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{faq.answer}</div>
                        </div>
                        <form action={deleteFAQ.bind(null, faq.id, widgetId)}>
                            <button style={{ color: '#ef4444', opacity: 0.6, background: 'none', border: 'none', padding: 4 }} title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </form>
                    </div>
                ))}
                {faqs.length === 0 && <div style={{ color: 'var(--secondary)', textAlign: 'center', padding: 20 }}>No FAQs yet.</div>}
            </div>
        </div>
    )
}

function EmbedCode({ widgetId }: { widgetId: string }) {
    const code = `<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget.js" data-widget-id="${widgetId}" defer></script>`

    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Install on your website</h3>
            <p style={{ color: 'var(--secondary)', marginBottom: 24 }}>Copy and paste this code just before the closing &lt;/body&gt; tag of your website.</p>

            <div style={{ position: 'relative' }}>
                <pre style={{ background: '#0f172a', padding: 20, borderRadius: 8, overflowX: 'auto', border: '1px solid #334155', color: '#f8fafc', fontFamily: 'monospace' }}>
                    {code}
                </pre>
                <Button
                    variant="secondary"
                    style={{ position: 'absolute', top: 12, right: 12 }}
                    onClick={() => navigator.clipboard.writeText(code)}
                >
                    Copy
                </Button>
            </div>
        </div>
    )
}

function AnalyticsView({ stats }: { stats: any }) {
    return (
        <div className="glass-panel fade-in" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 24 }}>Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12 }}>
                    <div style={{ color: 'var(--secondary)', marginBottom: 8 }}>Total Conversations</div>
                    <div className="heading-lg" style={{ fontSize: '2.5rem' }}>{stats.totalConversations}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 24, borderRadius: 12 }}>
                    <div style={{ color: 'var(--secondary)', marginBottom: 8 }}>Total Messages</div>
                    <div className="heading-lg" style={{ fontSize: '2.5rem' }}>{stats.totalMessages}</div>
                </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Recent Sessions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.recentConversations.map((conv: any) => (
                    <div key={conv.id} style={{ padding: 16, border: '1px solid var(--surface-border)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>Session {conv.id.slice(-6)}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{new Date(conv.updatedAt).toLocaleString()}</div>
                        </div>
                        <div className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', padding: '4px 8px', borderRadius: 4, fontSize: '0.8rem' }}>
                            {conv._count.messages} msgs
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
