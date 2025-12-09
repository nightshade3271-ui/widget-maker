import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { widgetId, name, email, interest, conversationId } = body

        // Validate required fields
        if (!widgetId || !name || !email || !interest) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Create the lead
        const lead = await db.lead.create({
            data: {
                widgetId,
                name,
                email,
                interest,
                conversationId: conversationId || null
            }
        })

        return NextResponse.json({ success: true, lead }, { status: 201 })
    } catch (error) {
        console.error('Error creating lead:', error)
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        )
    }
}

// Get leads for a specific widget
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const widgetId = searchParams.get('widgetId')

        if (!widgetId) {
            return NextResponse.json(
                { error: 'Widget ID required' },
                { status: 400 }
            )
        }

        const leads = await db.lead.findMany({
            where: { widgetId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ leads })
    } catch (error) {
        console.error('Error fetching leads:', error)
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        )
    }
}
