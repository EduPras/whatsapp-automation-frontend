
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AppLayout } from '@/components/app-layout';
import { DataProvider } from '@/lib/data-provider';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DataProvider>
        <AppLayout>{children}</AppLayout>
      </DataProvider>
    </NextIntlClientProvider>
  );
}
