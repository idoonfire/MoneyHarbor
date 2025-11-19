// Client-side PDF generation with perfect Hebrew support and proper page breaks

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generateInvestmentPDFClient(investment: any, userAmount: number, detailedGuide: any = null): Promise<string> {
  // Calculate estimated returns
  const getEstimatedReturn = (investment: any) => {
    if (investment.expectedReturn && typeof investment.expectedReturn === 'number') {
      return investment.expectedReturn / 100;
    }
    if (investment.riskLevel === 'נמוכה') return 0.04;
    if (investment.riskLevel === 'בינונית') return 0.08;
    return 0.12;
  };
  
  // Determine years from investment timeHorizon
  const getYearsFromTimeHorizon = (timeHorizon: string[]) => {
    if (timeHorizon.includes('קצר')) return 3;
    if (timeHorizon.includes('בינוני')) return 5;
    if (timeHorizon.includes('ארוך')) return 7;
    return 5; // default
  };
  
  const years = getYearsFromTimeHorizon(investment.timeHorizon || ['בינוני']);
  const estimatedReturn = getEstimatedReturn(investment);
  const initialAmount = userAmount || investment.minAmount || 10000;
  const futureValue = Math.round(initialAmount * Math.pow(1 + estimatedReturn, years));
  const totalReturn = futureValue - initialAmount;
  const returnPercentage = ((totalReturn / initialAmount) * 100).toFixed(1);

  // Create container for each page
  const createPage = (pageNumber: number, totalPages: number, content: string) => {
    return `
      <div style="width: 210mm; height: 297mm; background: white; padding: 0; margin: 0; position: relative; page-break-after: always; font-family: 'Times New Roman', Georgia, serif;">
        ${pageNumber === 1 ? `
        <!-- Header (only on first page) -->
        <div style="background: #1a1a1a; padding: 20px 40px; border-bottom: 3px solid #d4af37;">
          <div style="text-align: center;">
            <h1 style="font-size: 39px; font-weight: 300; color: #ffffff; margin: 0 0 8px 0; letter-spacing: 2px;">MoneyHarbor</h1>
            <div style="width: 60px; height: 2px; background: #d4af37; margin: 0 auto 8px;"></div>
            <p style="font-size: 15px; color: #d4af37; font-weight: 500; margin: 0; letter-spacing: 1px;">דוח מחקר השקעות</p>
          </div>
        </div>
        ` : `
        <!-- Page header for other pages -->
        <div style="padding: 15px 40px; border-bottom: 1px solid #dee2e6;">
          <div style="text-align: center;">
            <span style="font-size: 15px; color: #6c757d; font-weight: 500;">MoneyHarbor Investment Research</span>
          </div>
        </div>
        `}
        
        <!-- Page Content -->
        <div style="padding: ${pageNumber === 1 ? '20px' : '15px'} 40px; min-height: ${pageNumber === 1 ? '220mm' : '250mm'}; overflow: hidden;">
          ${content}
        </div>
        
        <!-- Page Number -->
        <div style="position: absolute; bottom: 15px; left: 0; right: 0; text-align: center;">
          <span style="font-size: 13px; color: #6c757d;">Page ${pageNumber} of ${totalPages}</span>
        </div>
      </div>
    `;
  };

  // PAGE 1 CONTENT
  const page1Content = `
    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0;">
      <h2 style="font-size: 33px; font-weight: 400; color: #1a1a1a; margin: 0; text-align: right; direction: rtl; unicode-bidi: embed; line-height: 1.3;">
        ${investment.name.replace(/\(/g, '‏(').replace(/\)/g, ')‏')}
      </h2>
    </div>
    
    ${investment.matchReason ? `
    <div style="background: #f8f9fa; border-right: 3px solid #6c757d; padding: 15px; margin-bottom: 18px;">
      <div style="font-size: 15px; font-weight: 600; color: #495057; margin-bottom: 8px; text-align: right;">נימוק ההשקעה</div>
      <p style="font-size: 16px; color: #212529; line-height: 1.5; text-align: right; margin: 0;">
        ${investment.matchReason}
      </p>
    </div>
    ` : ''}
    
    <div style="font-size: 16px; color: #495057; line-height: 1.5; margin-bottom: 18px; text-align: right;">
      ${investment.description}
    </div>
    
    <div style="border: 1px solid #dee2e6; margin-bottom: 18px;">
      <div style="background: #f8f9fa; padding: 10px 15px; border-bottom: 1px solid #dee2e6;">
        <h3 style="font-size: 16px; font-weight: 600; color: #212529; margin: 0; text-align: right;">תחזית תשואה משוערת</h3>
      </div>
      <div style="padding: 12px 15px;">
        <div style="font-size: 15px; color: #6c757d; margin-bottom: 12px; text-align: right;">
          <strong>דוגמה:</strong> השקעה של ₪${initialAmount.toLocaleString()} ל-${years} שנים
        </div>
        
        <!-- Investment Growth Chart -->
        <div style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border: 1px solid #e9ecef;">
          <table style="width: 100%; border-collapse: collapse; height: 70px;">
            <tr style="vertical-align: bottom;">
              ${(() => {
                let html = '';
                for (let i = 0; i <= years; i++) {
                  const value = Math.round(initialAmount * Math.pow(1 + estimatedReturn, i));
                  const heightPercent = Math.round((value / futureValue) * 100);
                  html += `
                    <td style="text-align: center; vertical-align: bottom; padding: 0 3px;">
                      <div style="font-size: 10px; color: #059669; font-weight: 700; margin-bottom: 8px;">₪${(value / 1000).toFixed(0)}K</div>
                      <div style="background: linear-gradient(180deg, #10b981 0%, #059669 100%); width: 100%; height: ${Math.max(heightPercent * 0.6, 15)}px; border-top-left-radius: 3px; border-top-right-radius: 3px;"></div>
                      <div style="font-size: 10px; color: #6c757d; margin-top: 4px; font-weight: 600;">${i === 0 ? 'התחלה' : `${i}`}</div>
                    </td>
                  `;
                }
                return html;
              })()}
            </tr>
          </table>
          <div style="font-size: 10px; color: #6c757d; text-align: center; margin-top: 5px;">צמיחת ההשקעה לאורך ${years} שנים</div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
          <tr style="border-bottom: 1px solid #e9ecef;">
            <td style="padding: 8px 10px; font-size: 15px; color: #495057; text-align: right; width: 60%;">תשואה שנתית משוערת</td>
            <td style="padding: 8px 10px; font-size: 15px; color: #212529; text-align: left; font-weight: 600; width: 40%;">${(estimatedReturn * 100).toFixed(1)}%</td>
          </tr>
          <tr style="border-bottom: 1px solid #e9ecef;">
            <td style="padding: 8px 10px; font-size: 15px; color: #495057; text-align: right; width: 60%;">סכום צפוי בסוף התקופה</td>
            <td style="padding: 8px 10px; font-size: 15px; color: #212529; text-align: left; font-weight: 600; width: 40%;">₪${futureValue.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 10px; font-size: 15px; color: #495057; text-align: right; width: 60%;">רווח משוער</td>
            <td style="padding: 8px 10px; font-size: 15px; color: #212529; text-align: left; font-weight: 600; width: 40%;">₪${totalReturn.toLocaleString()} (+${returnPercentage}%)</td>
          </tr>
        </table>
        <div style="font-size: 12px; color: #6c757d; text-align: right; line-height: 1.4; margin-top: 8px; font-style: italic;">
          * תחזית מבוססת על ביצועים היסטוריים. תשואות עבר אינן מבטיחות תשואות עתיד.
        </div>
      </div>
    </div>
    
    <div style="border: 1px solid #dee2e6; margin-bottom: 18px;">
      <div style="background: #f8f9fa; padding: 10px 15px; border-bottom: 1px solid #dee2e6;">
        <h3 style="font-size: 16px; font-weight: 600; color: #212529; margin: 0; text-align: right;">מידע מרכזי</h3>
      </div>
      <div style="padding: 12px 15px;">
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
          <tr style="border-bottom: 1px solid #e9ecef;">
            <td style="padding: 8px 10px; font-size: 15px; color: #495057; text-align: right; width: 60%;">רמת סיכון</td>
            <td style="padding: 8px 10px; font-size: 15px; color: #212529; text-align: left; font-weight: 600; width: 40%;">${investment.riskLevel}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e9ecef;">
            <td style="padding: 8px 10px; font-size: 15px; color: #495057; text-align: right; width: 60%;">טווח זמן</td>
            <td style="padding: 8px 10px; font-size: 15px; color: #212529; text-align: left; font-weight: 600; width: 40%;">${investment.timeHorizon.join(', ')}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e9ecef;">
            <td style="padding: 8px 10px; font-size: 15px; color: #495057; text-align: right; width: 60%;">נזילות</td>
            <td style="padding: 8px 10px; font-size: 15px; color: #212529; text-align: left; font-weight: 600; width: 40%;">${investment.liquidity}</td>
          </tr>
          ${investment.minAmount ? `
          <tr>
            <td style="padding: 8px 10px; font-size: 15px; color: #495057; text-align: right; width: 60%;">סכום מינימלי</td>
            <td style="padding: 8px 10px; font-size: 15px; color: #212529; text-align: left; font-weight: 600; width: 40%;">₪${Number(investment.minAmount).toLocaleString()}</td>
          </tr>
          ` : ''}
        </table>
      </div>
    </div>
    
  `;

  // PAGE 2 CONTENT (Combined everything)
  const page2Content = `
    <div style="margin-bottom: 15px;">
      <h3 style="font-size: 18px; font-weight: 600; color: #212529; margin: 0 0 8px 0; text-align: right; padding-bottom: 6px; border-bottom: 1px solid #dee2e6;">יתרונות</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${investment.pros.map((pro: string) => `
          <li style="font-size: 15px; color: #212529; margin-bottom: 5px; text-align: right; padding-right: 15px; position: relative; line-height: 1.5;">
            <span style="position: absolute; right: 0; color: #495057;">•</span>
            ${pro}
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div style="margin-bottom: 15px;">
      <h3 style="font-size: 18px; font-weight: 600; color: #212529; margin: 0 0 8px 0; text-align: right; padding-bottom: 6px; border-bottom: 1px solid #dee2e6;">סיכונים ושיקולים</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${investment.cons.map((con: string) => `
          <li style="font-size: 15px; color: #212529; margin-bottom: 5px; text-align: right; padding-right: 15px; position: relative; line-height: 1.5;">
            <span style="position: absolute; right: 0; color: #495057;">•</span>
            ${con}
          </li>
        `).join('')}
      </ul>
    </div>
    
    ${investment.actionSteps ? `
    <div style="margin-bottom: 15px;">
      <h3 style="font-size: 19px; font-weight: 600; color: #212529; margin: 0 0 10px 0; text-align: right; padding-bottom: 8px; border-bottom: 2px solid #1a1a1a;">מידע מעשי להתחלה</h3>
      
      ${investment.actionSteps.howToStart ? `
      <div style="background: #f8f9fa; border-right: 3px solid #6c757d; padding: 12px; margin-bottom: 12px;">
        <h4 style="font-size: 16px; font-weight: 600; color: #212529; margin: 0 0 6px 0; text-align: right;">איך מתחילים</h4>
        <p style="font-size: 15px; color: #495057; line-height: 1.5; text-align: right; margin: 0;">
          ${investment.actionSteps.howToStart}
        </p>
      </div>
      ` : ''}
      
      ${investment.actionSteps.platforms && investment.actionSteps.platforms.length > 0 ? `
      <div style="margin-bottom: 12px;">
        <h4 style="font-size: 16px; font-weight: 600; color: #212529; margin: 0 0 6px 0; text-align: right;">פלטפורמות מומלצות</h4>
        <ul style="list-style: none; padding: 0; margin: 0; border: 1px solid #dee2e6;">
          ${investment.actionSteps.platforms.slice(0, 5).map((platform: string) => `
            <li style="font-size: 13px; color: #212529; padding: 8px 12px; text-align: right; border-bottom: 1px solid #f1f3f5; line-height: 1.4;">
              ${platform}
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
      
      ${investment.actionSteps.costs ? `
      <div style="background: #f8f9fa; border-right: 3px solid #6c757d; padding: 12px; margin-bottom: 12px;">
        <h4 style="font-size: 16px; font-weight: 600; color: #212529; margin: 0 0 6px 0; text-align: right;">עלויות ועמלות</h4>
        <p style="font-size: 15px; color: #495057; line-height: 1.5; text-align: right; margin: 0;">
          ${investment.actionSteps.costs}
        </p>
      </div>
      ` : ''}
    </div>
    ` : ''}
    
    ${detailedGuide ? `
    <div style="margin-bottom: 15px;">
      ${detailedGuide.summary && detailedGuide.summary.length > 0 ? `
      <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 12px; margin-bottom: 12px;">
        <h4 style="font-size: 16px; font-weight: 600; color: #212529; margin: 0 0 6px 0; text-align: right;">נקודות סיכום</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${detailedGuide.summary.slice(0, 4).map((item: string) => `
            <li style="font-size: 13px; color: #212529; margin-bottom: 4px; text-align: right; padding-right: 12px; position: relative; line-height: 1.5;">
              <span style="position: absolute; right: 0; color: #6c757d;">•</span>
              ${item}
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
    </div>
    ` : ''}
    
    ${detailedGuide?.disclaimer ? `
    <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 12px; margin-top: 12px;">
      <p style="font-size: 12px; color: #856404; line-height: 1.4; text-align: right; margin: 0; font-weight: 600;">
        ${detailedGuide.disclaimer}
      </p>
    </div>
    ` : `
    <div style="background: #fff3cd; border: 2px solid #ffc107; padding: 12px; margin-top: 12px;">
      <p style="font-size: 12px; color: #856404; line-height: 1.4; text-align: right; margin: 0; font-weight: 600;">
        המידע בדוח זה הוא כללי וחינוכי בלבד, ואינו מהווה ייעוץ השקעות או ייעוץ מס אישי. מומלץ להיוועץ במומחה פיננסי מוסמך.
      </p>
    </div>
    `}
    
    <!-- Footer -->
    <div style="position: absolute; bottom: 40px; left: 40px; right: 40px; background: #1a1a1a; padding: 12px; border-top: 1px solid #495057;">
      <div style="text-align: center;">
        <p style="font-size: 13px; color: #adb5bd; margin: 0 0 5px 0; letter-spacing: 0.5px;">
          © 2025 MoneyHarbor Investment Research
        </p>
        <p style="font-size: 12px; color: #6c757d; margin: 0; line-height: 1.4;">
          דוח זה נועד למידע כללי בלבד
        </p>
      </div>
    </div>
  `;

  // Build complete HTML with 2 fixed pages
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '210mm';
  container.style.backgroundColor = 'white';
  container.style.direction = 'rtl';

  container.innerHTML = `
    <div style="width: 210mm; background: white;">
      ${createPage(1, 2, page1Content)}
      ${createPage(2, 2, page2Content)}
    </div>
  `;
  
  document.body.appendChild(container);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const canvas = await html2canvas(container, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    document.body.removeChild(container);
    
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let position = 0;
    let page = 0;
    
    while (position < imgHeight) {
      if (page > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight, undefined, 'FAST');
      position += pageHeight;
      page++;
    }
    
    const pdfBase64 = pdf.output('dataurlstring').split(',')[1];
    const sizeInMB = (pdfBase64.length * 0.75) / 1024 / 1024;
    console.log(`📦 PDF size: ${sizeInMB.toFixed(2)} MB, Pages: ${page}`);
    
    if (sizeInMB > 25) {
      throw new Error(`PDF גדול מדי (${sizeInMB.toFixed(1)} MB)`);
    }
    
    return pdfBase64;
    
  } catch (error) {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw error;
  }
}
