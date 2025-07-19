
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AppLayout } from '@/components/app-layout';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  
  return (
      <html lang={locale}>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased">
            <NextIntlClientProvider locale={locale} messages={messages}>
              <AppLayout>{children}</AppLayout>
            </NextIntlClientProvider>
        </body>
      </html>
  );
}
