'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWidget(formData: FormData): Promise<void> {
    const name = formData.get('name') as string
    const companyName = formData.get('companyName') as string

    if (!name) throw new Error('Name is required')

    const widget = await db.widget.create({
        data: {
            name,
            companyName: companyName || 'My Company',
        },
    })

    redirect(`/dashboard/${widget.id}`)
}

export async function updateWidget(id: string, formData: FormData) {
    const data: any = {}
    const fields = ['name', 'companyName', 'description', 'welcomeMessage', 'systemPrompt', 'primaryColor', 'secondaryColor']

    fields.forEach(field => {
        const value = formData.get(field)
        if (value !== null) data[field] = value
    })

    await db.widget.update({
        where: { id },
        data,
    })

    revalidatePath(`/dashboard/${id}`)
}

export async function deleteWidget(id: string) {
    await db.widget.delete({ where: { id } })
    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function createFAQ(widgetId: string, formData: FormData) {
    const question = formData.get('question') as string
    const answer = formData.get('answer') as string

    if (!question || !answer) throw new Error('Question and Answer are required')

    await db.fAQ.create({
        data: {
            question,
            answer,
            widgetId,
        },
    })

    revalidatePath(`/dashboard/${widgetId}`)
}

export async function deleteFAQ(id: string, widgetId: string) {
    await db.fAQ.delete({ where: { id } })
    revalidatePath(`/dashboard/${widgetId}`)
}

export async function getWidgetStats(widgetId: string) {
    const totalConversations = await db.conversation.count({ where: { widgetId } })
    const totalMessages = await db.message.count({ where: { conversation: { widgetId } } })
    const recentConversations = await db.conversation.findMany({
        where: { widgetId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { messages: true } } }
    })

    return {
        totalConversations,
        totalMessages,
        recentConversations
    }
}

export async function getSystemSettings() {
    let settings = await db.systemSettings.findUnique({ where: { id: 'default' } })
    if (!settings) {
        settings = await db.systemSettings.create({ data: { id: 'default' } })
    }
    return settings
}

export async function updateSystemSettings(formData: FormData) {
    const openRouterKey = formData.get('openRouterKey') as string
    const defaultModel = formData.get('defaultModel') as string

    await db.systemSettings.upsert({
        where: { id: 'default' },
        update: {
            openRouterKey: openRouterKey || null,
            defaultModel: defaultModel || 'google/gemini-2.0-flash-001'
        },
        create: {
            id: 'default',
            openRouterKey: openRouterKey || null,
            defaultModel: defaultModel || 'google/gemini-2.0-flash-001'
        }
    })

    revalidatePath('/dashboard/settings')
}
