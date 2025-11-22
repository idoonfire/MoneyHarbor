import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch all PDF requests (leads) from database
    const leads = await prisma.pDFRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        investmentName: true,
        investmentType: true,
        amount: true,
        timeHorizon: true,
        riskLevel: true,
        knowledgeLevel: true,
        additionalNotes: true,
        createdAt: true,
        pdfSent: true,
        sentAt: true,
      }
    });

    console.log(`📊 Fetched ${leads.length} leads from database`);

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads: leads
    });

  } catch (error: any) {
    console.error('❌ Error fetching leads:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}


