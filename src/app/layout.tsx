
import { ReactNode } from "react";
import {NextIntlClientProvider, useMessages} from 'next-intl';

// The following import is required to configure the locale for all pages
// that are rendered without a specific locale.
import '@/i18n';

export default function RootLayout({
    children,
    params: {locale}
  }: {
    children: ReactNode;
    params: {locale: string};
  }) {
    const messages = useMessages();
  
    return (
      <html lang={locale}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    );
  }

