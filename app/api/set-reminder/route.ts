import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { email, reminderDate } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    const formattedDate = new Date(reminderDate).toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    console.log('📧 Sending reminder confirmation to:', email);

    // Prepare HTML content
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 40px 20px; margin: 0; direction: rtl;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
      <div style="width: 50px; height: 3px; background: linear-gradient(90deg, #ff9500 0%, #ffb347 100%); margin: 0 auto 15px;"></div>
      <h1 style="margin: 0; color: #ff9500; font-size: 36px; font-weight: 300; letter-spacing: 1px;">MoneyHarbor</h1>
      <p style="margin: 10px 0 0; color: #ffb347; font-size: 13px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Investment Intelligence</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #1a1a1a; font-size: 26px; font-weight: 300; margin: 0 0 8px 0; text-align: right;">🔔 התזכורת שלך נשמרה!</h2>
      <div style="width: 35px; height: 2px; background: #ffb347; margin: 0 0 20px auto;"></div>
      
      <p style="color: #4a4a4a; font-size: 16px; line-height: 1.8; margin-bottom: 20px; text-align: right;">
        נשלח לך מייל תזכורת ב<strong style="color: #ffb347; font-weight: 600;">${formattedDate}</strong> לבדוק מחדש את הנמל שלך ולעדכן את אסטרטגיית ההשקעות.
      </p>
      
      <div style="background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%); border-right: 3px solid #ffb347; border-radius: 6px; padding: 20px; margin: 25px 0;">
        <p style="margin: 0; color: #1a1a1a; font-size: 15px; line-height: 1.7; text-align: right;">
          💡 <strong>טיפ:</strong> בינתיים, אתה תמיד יכול לחזור לדף "הנמל שלי" כדי לעקוב אחרי ההשקעות שלך ולעדכן את מצב העגינה.
        </p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://money-harbor.vercel.app/my-harbor" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #ff9500 0%, #ffb347 100%); color: #0a0a0a; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(255, 149, 0, 0.2);">
          לדף הנמל שלי ⚓
        </a>
      </div>

      <!-- Disclaimer -->
      <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 25px;">
        <p style="color: #999; font-size: 11px; margin: 0; line-height: 1.6; text-align: right;">
          <strong style="color: #666;">הצהרה:</strong> מייל זה הוא אישור לתזכורת שביקשת. המידע בדו״חות הוא כללי וחינוכי בלבד ואינו מהווה ייעוץ השקעות.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #1a1a1a; padding: 25px; text-align: center;">
      <p style="margin: 0 0 6px; color: #8a8a8a; font-size: 11px; letter-spacing: 0.5px;">© 2025 MoneyHarbor</p>
      <p style="margin: 0; color: #666; font-size: 10px;">נבנה עם מקצועיות למשקיעים בישראל</p>
    </div>

  </div>
</body>
</html>
    `;

    // Send reminder confirmation email via Brevo
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "MoneyHarbor", email: "noreply@moneyharbor.online" };
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.subject = '🔔 תזכורת נקבעה - MoneyHarbor';
    sendSmtpEmail.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('✅ Reminder confirmation sent successfully');

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Error setting reminder:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set reminder' },
      { status: 500 }
    );
  }
}

