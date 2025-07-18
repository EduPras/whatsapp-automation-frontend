
import { CalendarClock, Inbox, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Header } from '@/components/header';
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar side="left" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
              <MessageSquareText className="h-6 w-6 text-primary" />
              <span className="ml-2 font-semibold font-headline">Scheduled Messenger</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Templates">
                  <Link href="/templates">
                    <Inbox />
                    Templates
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Scheduled">
                   <Link href="/scheduled">
                    <CalendarClock />
                    Scheduled
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1">
          <Header />
          <main>
            {children}
          </main>
          <Toaster />
        </div>
      </div>
    </SidebarProvider>
  );
}
