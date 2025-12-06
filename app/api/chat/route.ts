import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { widgetId, messages, conversationId } = await request.json()

        if (!widgetId || !messages) {
            return new NextResponse('Missing widgetId or messages', { status: 400 })
        }

        const widget = await db.widget.findUnique({
            where: { id: widgetId },
            include: { faqs: true }
        })

        if (!widget) {
            return new NextResponse('Widget not found', { status: 404 })
        }

        // Manage Conversation ID
        let currentConversationId = conversationId
        if (!currentConversationId) {
            const conv = await db.conversation.create({
                data: { widgetId }
            })
            currentConversationId = conv.id
        }

        // Save User Message
        const lastUserMessage = messages[messages.length - 1]
        if (lastUserMessage.role === 'user') {
            await db.message.create({
                data: {
                    conversationId: currentConversationId,
                    role: 'user',
                    content: lastUserMessage.content
                }
            })
        }

        // Prepare Context with FAQs
        // Simple FAQ matching in system prompt or RAG?
        // For simplicity, we'll append FAQs to the system prompt.
        const fqaText = widget.faqs.map((f: { question: string, answer: string }) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
        const systemInstruction = `${widget.systemPrompt}\n\nRelevant Information:\n${fqaText}\n\nYou represent ${widget.companyName}.`

        const openRouterMessages = [
            { role: 'system', content: systemInstruction },
            ...messages
        ]

        // Fetch System Settings
        const settings = await db.systemSettings.findUnique({ where: { id: 'default' } })
        const apiKey = settings?.openRouterKey || process.env.OPENROUTER_API_KEY
        const model = settings?.defaultModel || 'google/gemini-2.0-flash-001'

        if (!apiKey) {
            console.error('OpenRouter API Key is missing');
            return new NextResponse('OpenRouter API Key is not configured', { status: 500 })
        }

        // Call OpenRouter
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://widget-maker.com', // Optional
                'X-Title': 'WidgetMaker'
            },
            body: JSON.stringify({
                model: model,
                messages: openRouterMessages,
            })
        })

        if (!response.ok) {
            console.error('OpenRouter Error', await response.text())
            return new NextResponse('Error generating response', { status: 500 })
        }

        const data = await response.json()
        const botMessage = data.choices[0].message.content

        // Save Bot Message
        await db.message.create({
            data: {
                conversationId: currentConversationId,
                role: 'assistant',
                content: botMessage
            }
        })

        // Return response with conversationId
        return NextResponse.json({
            role: 'assistant',
            content: botMessage,
            conversationId: currentConversationId
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        })

    } catch (error) {
        console.error(error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    })
}
