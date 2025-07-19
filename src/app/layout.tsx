
import { ReactNode } from "react";

export default function RootLayout({
    children,
    params: {locale}
  }: {
    children: ReactNode;
    params: {locale: string};
  }) {
    return (
      <html lang={locale}>
        <body>
          {children}
        </body>
      </html>
    );
  }


