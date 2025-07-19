
"use client";

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl';
import '../globals.css';
import { CalendarClock, Inbox, MessageSquareText, FolderPlus, Folder, Trash2, CalendarCheck, Settings } from "lucide-react";
import Link from "next/link";
import { Header } from '@/components/header';
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
  SidebarMenuAction
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

const initialFolders: FolderType[] = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Appointment Reminders' },
  { id: '3', name: 'General' },
];

function AppLayout({ children, locale }: { children: React.ReactNode; locale: string }) {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');
  const tButtons = useTranslations('Buttons');

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

  const isLoginPage = pathname === `/${locale}`;
  
  const tLoginPage = useTranslations('LoginPage');
  const tSidebar = useTranslations('Sidebar');
  const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-4.25 1.62-5.03 0-9.12-4.09-9.12-9.12s4.09-9.12 9.12-9.12c2.82 0 4.84 1.09 6.24 2.44l-2.5 2.52c-.81-.79-1.85-1.25-3.74-1.25-3.03 0-5.49 2.46-5.49 5.49s2.46 5.49 5.49 5.49c2.18 0 3.32-.94 3.48-2.68h-3.48z"
      ></path>
    </svg>
  );

  if (isLoginPage) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="absolute top-8 left-8 flex items-center gap-2 text-lg font-semibold">
                <MessageSquareText className="h-6 w-6 text-primary" />
                <span className="font-headline">{tSidebar('appName')}</span>
            </div>
            <div className="w-full max-w-md shadow-2xl rounded-lg border bg-card text-card-foreground">
                <div className="p-6 text-center">
                    <h1 className="text-2xl font-headline tracking-tight">{tLoginPage('title')}</h1>
                    <p>{tLoginPage('description')}</p>
                </div>
                <div className="p-6 pt-0">
                    <div className="flex flex-col gap-4">
                        <Button asChild className="w-full" size="lg">
                        <Link href="/templates">
                            <GoogleIcon />
                            {tLoginPage('signInWithGoogle')}
                        </Link>
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                        {tLoginPage('terms')}
                        </p>
                    </div>
                </div>
            </div>
            <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
                {tLoginPage('copyright', {year: new Date().getFullYear()})}
            </footer>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex flex-1 h-screen">
        <Sidebar side="left" collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
              <MessageSquareText className="h-6 w-6 text-primary" />
              <span className="ml-2 font-semibold font-headline">{t('appName')}</span>
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
        </Sidebar>

        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
          <Toaster />
        </div>
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

export default function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();
  const locale = params.locale;
  
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppLayout locale={locale}>{children}</AppLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
