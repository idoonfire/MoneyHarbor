import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MoneyHarbor | נמל הכסף',
  description: 'גלו איפה הכי כדאי לעגן את הכסף שלכם - אתר חינוכי לחקר אפשרויות השקעה פסיבית',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}

