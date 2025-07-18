import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster";

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Toaster />
    </div>
  );
}
