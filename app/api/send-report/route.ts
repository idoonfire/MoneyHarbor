import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { prisma } from '@/lib/prisma';

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, fullName, investment, pdfBase64, searchParams } = body;

    console.log('📨 Received email request for:', email, 'Name:', fullName);
    console.log('📄 PDF Base64 length:', pdfBase64?.length || 0);
    console.log('📊 Search params:', searchParams);

    if (!email || !investment || !pdfBase64) {
      console.error('❌ Missing fields:', { hasEmail: !!email, hasName: !!fullName, hasInvestment: !!investment, hasPDF: !!pdfBase64 });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check PDF size
    const pdfSizeMB = (pdfBase64.length * 0.75) / 1024 / 1024;
    console.log(`📦 PDF size: ${pdfSizeMB.toFixed(2)} MB`);
    
    if (pdfSizeMB > 25) {
      console.error('❌ PDF too large:', pdfSizeMB.toFixed(2), 'MB');
      return NextResponse.json(
        { error: `PDF גדול מדי (${pdfSizeMB.toFixed(1)} MB)` },
        { status: 413 }
      );
    }

    console.log('📧 Sending email with PDF attachment via Brevo...');

    // Prepare HTML content
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 50px 20px; margin: 0; direction: rtl;">
  <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
    
    <!-- Elegant Header -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 50px 40px; text-align: center; position: relative;">
      <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #ffd700 0%, #d4af37 100%); margin: 0 auto 20px;"></div>
      <h1 style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 300; letter-spacing: 1px;">MoneyHarbor</h1>
      <p style="margin: 12px 0 0; color: #d4af37; font-size: 14px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Investment Intelligence</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 50px 40px;">
      <h2 style="color: #1a1a1a; font-size: 28px; font-weight: 300; margin: 0 0 10px 0; text-align: right;">הדו״ח המותאם שלך מוכן</h2>
      <div style="width: 40px; height: 2px; background: #d4af37; margin: 0 0 25px auto;"></div>
      
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.9; margin-bottom: 30px; text-align: right;">
        ${fullName ? `שלום ${fullName},` : 'שלום רב,'}
      </p>
      
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.9; margin-bottom: 30px; text-align: right;">
        מצורף דו״ח השקעה מקצועי ומפורט שהוכן במיוחד עבורך על <strong style="color: #d4af37; font-weight: 600;">${investment.name}</strong>.
      </p>
      
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.9; margin-bottom: 35px; text-align: right;">
        הדו״ח כולל ניתוח מעמיק, מדריך מעשי צעד אחר צעד, פלטפורמות מומלצות, ופירוט מלא של עלויות וטיפים מקצועיים.
      </p>
      
      <!-- Attachment Box -->
      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%); border: 1px solid #d4af37; border-right: 4px solid #d4af37; border-radius: 8px; padding: 25px; margin-bottom: 35px;">
        <p style="margin: 0; color: #1a1a1a; font-size: 15px; font-weight: 600; text-align: right;">
          קובץ PDF מצורף למייל זה
        </p>
        <p style="margin: 8px 0 0; color: #666; font-size: 13px; text-align: right;">
          המסמך המצורף מכיל את כל המידע הדרוש לביצוע ההשקעה
        </p>
      </div>

      <!-- Disclaimer -->
      <div style="border-top: 1px solid #e9ecef; padding-top: 25px;">
        <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.6; text-align: right;">
          <strong style="color: #666;">הצהרה חשובה:</strong> המידע המוצג בדו״ח הינו כללי וחינוכי בלבד ואינו מהווה ייעוץ השקעות אישי או המלצה לביצוע פעולות. מומלץ להיוועץ במומחה פיננסי מוסמך בטרם ביצוע החלטות השקעה.
        </p>
      </div>
    </div>

    <!-- Professional Footer -->
    <div style="background: #1a1a1a; padding: 30px 40px; text-align: center;">
      <p style="margin: 0 0 8px; color: #8a8a8a; font-size: 11px; letter-spacing: 0.5px;">
        © 2025 MoneyHarbor
      </p>
      <p style="margin: 0; color: #666; font-size: 11px;">
        נבנה עם מקצועיות למשקיעים בישראל
      </p>
    </div>

  </div>
</body>
</html>
    `;

    // Send email with PDF attachment via Brevo
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "MoneyHarbor", email: "noreply@moneyharbor.online" };
    sendSmtpEmail.to = [{ email: email, name: fullName || email }];
    sendSmtpEmail.subject = `דוח השקעה מ-MoneyHarbor: ${investment.name}`;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.attachment = [{
      content: pdfBase64,
      name: `MoneyHarbor-Investment-Report-${Date.now()}.pdf`
    }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('✅ Email with PDF sent successfully:', data);

    // Save PDF request to database for lead tracking
    try {
      const pdfRequest = await prisma.pDFRequest.create({
        data: {
          email: email,
          fullName: fullName || null,
          investmentName: investment.name || 'Unknown',
          investmentType: investment.riskLevel || null,
          amount: searchParams?.amount || investment.minAmount || 0,
          timeHorizon: searchParams?.timeHorizon || 
                      (Array.isArray(investment.timeHorizon) ? investment.timeHorizon.join(', ') : investment.timeHorizon) || '',
          riskLevel: searchParams?.riskLevel || investment.riskLevel || '',
          knowledgeLevel: searchParams?.knowledgeLevel || null,
          additionalNotes: searchParams?.additionalNotes || null,
          pdfSent: true,
          sentAt: new Date(),
        }
      });
      console.log('✅ PDF request saved to database:', pdfRequest.id);
    } catch (dbError) {
      console.error('⚠️ Error saving to database:', dbError);
      // Don't fail the whole request if DB save fails - continue sending email
    }

    return NextResponse.json({
      success: true,
      messageId: (data as any)?.id || 'sent'
    });

  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
