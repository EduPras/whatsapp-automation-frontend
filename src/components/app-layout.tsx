
"use client";

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import '../app/globals.css';
import { CalendarClock, Inbox, MessageSquareText, FolderPlus, Folder, Trash2, CalendarCheck, Settings, LogOut, PanelLeft } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuAction,
  SidebarFooter,
  SidebarTrigger,
  useSidebar
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { cn } from '@/lib/utils';

const initialFolders: FolderType[] = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Appointment Reminders' },
  { id: '3', name: 'General' },
];

function FloatingSidebarTrigger() {
    const { state, toggleSidebar } = useSidebar();
    
    if (state === 'expanded') {
        return null;
    }
    
    return (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
             <Button
                size="icon"
                onClick={toggleSidebar}
                className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Toggle Sidebar"
            >
                <PanelLeft />
            </Button>
        </div>
    )
}

function UserProfile() {
  const tHeader = useTranslations('Header');
  const { state } = useSidebar();
  
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center w-full gap-2 p-2 rounded-md transition-colors hover:bg-sidebar-accent",
               state === 'collapsed' && 'justify-center p-0 h-10 w-10'
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt={tHeader('user')} data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className={cn("flex flex-col items-start truncate", state === 'collapsed' && 'hidden')}>
                  <span className="text-sm font-medium text-sidebar-foreground">{tHeader('user')}</span>
                  <span className="text-xs text-muted-foreground truncate">user@example.com</span>
              </div>
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mb-2" side="top" align="start" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{tHeader('user')}</p>
              <p className="text-xs leading-none text-muted-foreground">
                user@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>{tHeader('settings')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{tHeader('logout')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Sidebar');
  const tButtons = useTranslations('Buttons');
  const pathname = usePathname();
  const loginPage = pathname.endsWith('/en') || pathname.endsWith('/pt-BR');

  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null);

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

  const handleDeleteFolder = () => {
    if (folderToDelete) {
      setFolders(folders.filter(f => f.id !== folderToDelete.id));
      setFolderToDelete(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex flex-1 h-screen">
        <Sidebar side="left" collapsible="icon">
          <SidebarHeader>
             <div className="flex items-center justify-between p-2">
               <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                  <MessageSquareText className="h-6 w-6 text-primary" />
                  <span className="font-semibold font-headline">{t('appName')}</span>
               </div>
                <SidebarTrigger />
             </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('templates')}>
                  <Link href="/templates">
                    <Inbox />
                    {t('templates')}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('scheduled')}>
                  <Link href="/scheduled">
                    <CalendarClock />
                    {t('scheduled')}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('settings')}>
                  <Link href="/settings">
                    <Settings />
                    {t('settings')}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="flex justify-between items-center">
                {t('folders')}
                <Button variant="ghost" size="icon" className="h-6 w-6 group-data-[collapsible=icon]:hidden" onClick={() => setIsFolderFormOpen(true)}>
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={t('allTemplates')}>
                      <Link href="/templates">
                        <Inbox />
                        {t('allTemplates')}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {folders.map(folder => {
                    const isAppointmentFolder = folder.name === 'Appointment Reminders';
                    const folderName = folder.name === 'Appointment Reminders' ? t('appointmentReminders') : folder.name;
                    return (
                      <SidebarMenuItem key={folder.id}>
                        <SidebarMenuButton asChild tooltip={folderName}>
                          <Link href={`/templates?folder=${folder.name}`}>
                            {isAppointmentFolder ? <CalendarCheck /> : <Folder />}
                            {folderName}
                          </Link>
                        </SidebarMenuButton>
                        {!isAppointmentFolder && (
                          <SidebarMenuAction
                            showOnHover
                            onClick={() => setFolderToDelete(folder)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label={`Delete ${folderName} folder`}
                          >
                            <Trash2 />
                          </SidebarMenuAction>
                        )}
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
           <SidebarFooter>
              <UserProfile />
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
          <Toaster />
        </div>
        <FloatingSidebarTrigger />
      </div>

      <Dialog open={isFolderFormOpen} onOpenChange={setIsFolderFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('createNewFolder')}</DialogTitle>
            <DialogDescription>{t('folderNameDescription')}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={t('folderNamePlaceholder')}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFolderFormOpen(false)}>{tButtons('cancel')}</Button>
            <Button onClick={handleSaveFolder}>{tButtons('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!folderToDelete} onOpenChange={() => setFolderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteFolderTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteFolderDescription', { folderName: folderToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFolderToDelete(null)}>{tButtons('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFolder} className="bg-destructive hover:bg-destructive/90">
              {t('deleteFolderAction')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
