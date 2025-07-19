
"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from 'react';
import { PlusCircle, CalendarClock, Send, MoreHorizontal, Pencil, Trash2, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ScheduledMessage, Contact, Template } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

const initialTemplates: Template[] = [
    { id: '1', title: 'Welcome Message', content: 'Hi {{client_name}}, welcome!', createdAt: new Date(), folder: 'General' },
    { id: '2', title: 'Appointment Reminder', content: 'Reminder for \'{{appointment_time}}\'.', createdAt: new Date(), folder: 'Appointment Reminders' }
];

const initialScheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    contacts: [initialContacts[0]],
    content: 'Hi Alice, just a reminder about our meeting tomorrow at 10 AM. See you then!',
    scheduledAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'scheduled',
  },
  {
    id: '2',
    contacts: [initialContacts[1]],
    content: 'Hey Bob, did you get a chance to look at the proposal? Let me know your thoughts.',
    scheduledAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    status: 'scheduled',
    templateId: '2',
  },
  {
    id: '3',
    contacts: [initialContacts[0]],
    content: 'Welcome aboard, Alice! We are thrilled to have you.',
    scheduledAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'sent',
    templateId: '1',
  },
   {
    id: '4',
    contacts: [initialContacts[0], initialContacts[1], initialContacts[2]],
    content: 'Hi team, project update meeting is scheduled for Friday. Please confirm your availability.',
    scheduledAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    status: 'scheduled',
  },
];

const FormattedDate = ({ date }: { date: Date }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    return <>{format(date, 'PPP p')}</>;
}

export default function ScheduledMessagesPage() {
  const [messages, setMessages] = useState<ScheduledMessage[]>(initialScheduledMessages);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const t = useTranslations('ScheduledPage');
  const tButtons = useTranslations('Buttons');

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      setMessages(messages.filter(m => m.id !== messageToDelete));
      setMessageToDelete(null);
    }
  };

  const getTemplateName = (templateId?: string) => {
      if (!templateId) return <Badge variant="secondary">{t('manual')}</Badge>;
      const template = initialTemplates.find(t => t.id === templateId);
      return template ? <Badge variant="outline">{template.title}</Badge> : <Badge variant="secondary">{t('manual')}</Badge>;
  }

  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;

    const lowercasedFilter = searchTerm.toLowerCase();
    return messages.filter(msg =>
      msg.contacts.some(c => c.name.toLowerCase().includes(lowercasedFilter) || c.email.toLowerCase().includes(lowercasedFilter)) ||
      msg.content.toLowerCase().includes(lowercasedFilter)
    );
  }, [messages, searchTerm]);

  const upcomingMessages = filteredMessages.filter(m => m.status === 'scheduled');
  const sentMessages = filteredMessages.filter(m => m.status === 'sent');

  return (
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
            {t('title')}
          </h1>
          <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder={t('searchPlaceholder')} 
                      className="pl-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground flex-shrink-0">
                  <Link href="/scheduled/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('scheduleAction')}
                  </Link>
              </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
              {t('upcoming')} <Badge variant="secondary" className="ml-2">{upcomingMessages.length}</Badge>
          </h2>
          {upcomingMessages.length > 0 ? (
              <div className="rounded-lg border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>{t('contactsHeader')}</TableHead>
                              <TableHead>{t('contentHeader')}</TableHead>
                              <TableHead className="hidden md:table-cell">{t('scheduledAtHeader')}</TableHead>
                              <TableHead className="hidden md:table-cell">{t('templateHeader')}</TableHead>
                              <TableHead className="text-right">{t('actionsHeader')}</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {upcomingMessages.map(msg => (
                              <TableRow key={msg.id}>
                                  <TableCell>
                                      <div className="flex items-center gap-3">
                                        {msg.contacts.length === 1 ? (
                                          <>
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={msg.contacts[0].avatarUrl} alt={msg.contacts[0].name} data-ai-hint="person avatar" />
                                                <AvatarFallback>{msg.contacts[0].name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{msg.contacts[0].name}</div>
                                                <div className="text-sm text-muted-foreground hidden md:block">{msg.contacts[0].email}</div>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <Avatar className="h-9 w-9">
                                              <AvatarFallback><Users className="h-5 w-5"/></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{t('groupMessage')}</div>
                                                <div className="text-sm text-muted-foreground">{t('recipients', {count: msg.contacts.length})}</div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <p className="max-w-xs truncate text-sm text-muted-foreground">{msg.content}</p>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell"><FormattedDate date={msg.scheduledAt} /></TableCell>
                                  <TableCell className="hidden md:table-cell">{getTemplateName(msg.templateId)}</TableCell>
                                  <TableCell className="text-right">
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                              <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                          <DropdownMenuItem asChild>
                                              <Link href={`/scheduled/edit/${msg.id}`}>
                                              <Pencil className="mr-2 h-4 w-4" />
                                              {tButtons('edit')}
                                              </Link>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => setMessageToDelete(msg.id)} className="text-destructive">
                                              <Trash2 className="mr-2 h-4 w-4" />
                                              {tButtons('delete')}
                                          </DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">{t('noUpcomingMessages')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? t('noUpcomingMessagesSearch', {searchTerm}) : t('noUpcomingMessagesDescription')}
                </p>
              </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
              {t('sent')} <Badge variant="secondary" className="ml-2">{sentMessages.length}</Badge>
          </h2>
          {sentMessages.length > 0 ? (
              <div className="rounded-lg border">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>{t('contactsHeader')}</TableHead>
                              <TableHead>{t('contentHeader')}</TableHead>
                              <TableHead className="hidden md:table-cell">{t('sentAtHeader')}</TableHead>
                              <TableHead className="hidden md:table-cell">{t('templateHeader')}</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {sentMessages.map(msg => (
                              <TableRow key={msg.id}>
                                  <TableCell>
                                      <div className="flex items-center gap-3">
                                          {msg.contacts.length === 1 ? (
                                          <>
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={msg.contacts[0].avatarUrl} alt={msg.contacts[0].name} data-ai-hint="person avatar" />
                                                <AvatarFallback>{msg.contacts[0].name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{msg.contacts[0].name}</div>
                                                <div className="text-sm text-muted-foreground hidden md:block">{msg.contacts[0].email}</div>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <Avatar className="h-9 w-9">
                                              <AvatarFallback><Users className="h-5 w-5"/></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{t('groupMessage')}</div>
                                                <div className="text-sm text-muted-foreground">{t('recipients', {count: msg.contacts.length})}</div>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <p className="max-w-xs truncate text-sm text-muted-foreground">{msg.content}</p>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell"><FormattedDate date={msg.scheduledAt} /></TableCell>
                                  <TableCell className="hidden md:table-cell">{getTemplateName(msg.templateId)}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <Send className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">{t('noSentMessages')}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm ? t('noSentMessagesSearch', {searchTerm}) : t('noSentMessagesDescription')}
                </p>
              </div>
          )}
        </div>

        <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('deleteMessageTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deleteMessageDescription')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setMessageToDelete(null)}>{tButtons('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                {tButtons('delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}
