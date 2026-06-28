import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{10}$/, 'Enter 10-digit  phone number'),
  zipCode: z.string().length(5, 'ZIP must be 5 digits'),
  vehicleYear: z.coerce.number().min(1990).max(2026),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  hasInsurance: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      )
    }

    // server-side vehicle check — client pe trust mat karo
    const vehicleExists = await prisma.vehicle.findFirst({
      where: {
        year: parsed.data.vehicleYear,
        make: parsed.data.vehicleMake,
        model: parsed.data.vehicleModel,
      },
    })

    if (!vehicleExists) {
      return NextResponse.json(
        { error: 'Invalid vehicle combination' },
        { status: 400 }
      )
    }

    const lead = await prisma.lead.create({
      data: {
        ...parsed.data,
        hasInsurance: parsed.data.hasInsurance ?? false,
      },
    })

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (err) {
    console.error('Lead creation failed:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}