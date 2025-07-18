
"use client";

import { CalendarClock, Inbox, MessageSquareText, FolderPlus, Folder } from "lucide-react";
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
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import type { Folder as FolderType } from '@/lib/types';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const initialFolders: FolderType[] = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Appointments' },
  { id: '3', name: 'General' },
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleSaveFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderType = {
        id: (folders.length + 1).toString(),
        name: newFolderName.trim(),
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsFolderFormOpen(false);
    }
  };

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
            <SidebarSeparator />
             <SidebarGroup>
                <SidebarGroupLabel className="flex justify-between items-center">
                  Folders
                   <Button variant="ghost" size="icon" className="h-6 w-6 group-data-[collapsible=icon]:hidden" onClick={() => setIsFolderFormOpen(true)}>
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                     <SidebarMenu>
                        <SidebarMenuItem>
                             <SidebarMenuButton asChild tooltip="All Templates">
                                <Link href="/templates">
                                    <Inbox/>
                                    All Templates
                                </Link>
                             </SidebarMenuButton>
                        </SidebarMenuItem>
                        {folders.map(folder => (
                            <SidebarMenuItem key={folder.id}>
                                <SidebarMenuButton asChild tooltip={folder.name}>
                                    <Link href={`/templates?folder=${folder.name}`}>
                                        <Folder/>
                                        {folder.name}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <Header />
          <main>
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </div>

       <Dialog open={isFolderFormOpen} onOpenChange={setIsFolderFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFolderFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveFolder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
