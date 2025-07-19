
"use client";

import Link from "next/link";
import { useState } from 'react';
import { PlusCircle, CalendarClock, Send, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ScheduledMessage, Contact, Template } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
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

const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

const initialTemplates: Template[] = [
    { id: '1', title: 'Welcome Message', content: 'Hi {{client_name}}, welcome!', createdAt: new Date(), folder: 'General' },
    { id: '2', title: 'Appointment Reminder', content: 'Reminder for {{appointment_time}}.', createdAt: new Date(), folder: 'Appointment Reminders' }
];

const initialScheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    contact: initialContacts[0],
    content: 'Hi Alice, just a reminder about our meeting tomorrow at 10 AM. See you then!',
    scheduledAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'scheduled',
  },
  {
    id: '2',
    contact: initialContacts[1],
    content: 'Hey Bob, did you get a chance to look at the proposal? Let me know your thoughts.',
    scheduledAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    status: 'scheduled',
    templateId: '2',
  },
  {
    id: '3',
    contact: initialContacts[0],
    content: 'Welcome aboard, Alice! We are thrilled to have you.',
    scheduledAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'sent',
    templateId: '1',
  },
];

export default function ScheduledMessagesPage() {
  const [messages, setMessages] = useState<ScheduledMessage[]>(initialScheduledMessages);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (messageToDelete) {
      setMessages(messages.filter(m => m.id !== messageToDelete));
      setMessageToDelete(null);
    }
  };

  const getTemplateName = (templateId?: string) => {
      if (!templateId) return <Badge variant="secondary">Manual</Badge>;
      const template = initialTemplates.find(t => t.id === templateId);
      return template ? <Badge variant="outline">{template.title}</Badge> : <Badge variant="secondary">Manual</Badge>;
  }

  const upcomingMessages = messages.filter(m => m.status === 'scheduled');
  const sentMessages = messages.filter(m => m.status === 'sent');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
          Scheduled Messages
        </h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/scheduled/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Message
            </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            Upcoming <Badge variant="secondary" className="ml-2">{upcomingMessages.length}</Badge>
        </h2>
        {upcomingMessages.length > 0 ? (
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contact</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Scheduled At</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {upcomingMessages.map(msg => (
                            <TableRow key={msg.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={msg.contact.avatarUrl} alt={msg.contact.name} data-ai-hint="person avatar" />
                                            <AvatarFallback>{msg.contact.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{msg.contact.name}</div>
                                            <div className="text-sm text-muted-foreground">{msg.contact.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="max-w-xs truncate text-sm text-muted-foreground">{msg.content}</p>
                                </TableCell>
                                <TableCell>{format(msg.scheduledAt, 'PPP p')}</TableCell>
                                <TableCell>{getTemplateName(msg.templateId)}</TableCell>
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
                                            Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setMessageToDelete(msg.id)} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
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
              <h3 className="mt-4 text-lg font-medium">No upcoming messages</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Schedule a new message to get started.
              </p>
            </div>
        )}
      </div>

       <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            Sent <Badge variant="secondary" className="ml-2">{sentMessages.length}</Badge>
        </h2>
        {sentMessages.length > 0 ? (
            <div className="rounded-lg border">
                <Table>
                     <TableHeader>
                        <TableRow>
                            <TableHead>Contact</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Sent At</TableHead>
                            <TableHead>Template</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sentMessages.map(msg => (
                            <TableRow key={msg.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={msg.contact.avatarUrl} alt={msg.contact.name} data-ai-hint="person avatar" />
                                            <AvatarFallback>{msg.contact.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{msg.contact.name}</div>
                                            <div className="text-sm text-muted-foreground">{msg.contact.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="max-w-xs truncate text-sm text-muted-foreground">{msg.content}</p>
                                </TableCell>
                                <TableCell>{format(msg.scheduledAt, 'PPP p')}</TableCell>
                                <TableCell>{getTemplateName(msg.templateId)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Send className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No sent messages yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your sent messages will appear here.
              </p>
            </div>
        )}
      </div>

      <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the scheduled message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMessageToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
