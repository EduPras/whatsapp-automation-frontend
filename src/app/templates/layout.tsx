import { CalendarClock, Folder, Inbox, MessageSquareText, PlusCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
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

      <SidebarInset>
        <div className="min-h-screen bg-background">
          <Header />
          <main>{children}</main>
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
