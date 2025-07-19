
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Clock, Send, Sparkles, Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import type { Contact, ScheduledMessage } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Mock data - in a real app, this would come from a database/API
const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

const initialScheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    contact: initialContacts[0],
    content: 'Hi Alice, just a reminder about our meeting tomorrow at 10 AM. See you then!',
    scheduledAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    status: 'scheduled',
  },
  {
    id: '2',
    contact: initialContacts[1],
    content: 'Hey Bob, did you get a chance to look at the proposal? Let me know your thoughts.',
    scheduledAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    templateId: '2',
  },
];


const formSchema = z.object({
  contactId: z.string().min(1, 'Please select a contact.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  scheduledAtDate: z.date({ required_error: "Please select a date." }),
  scheduledAtTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
});

export default function EditScheduledMessagePage() {
  const params = useParams();
  const id = params.id as string;
  const [contacts] = useState<Contact[]>(initialContacts);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [message, setMessage] = useState<ScheduledMessage | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactId: '',
      content: '',
      scheduledAtTime: '09:00',
    },
  });

  useEffect(() => {
    if (id) {
        const messageToEdit = initialScheduledMessages.find(m => m.id === id);
        if (messageToEdit) {
            setMessage(messageToEdit);
            form.reset({
                contactId: messageToEdit.contact.id,
                content: messageToEdit.content,
                scheduledAtDate: messageToEdit.scheduledAt,
                scheduledAtTime: format(messageToEdit.scheduledAt, 'HH:mm'),
            });
        }
    }
  }, [id, form]);

  const contentValue = form.watch('content');

  const handleAiEnrich = async () => {
    toast({ title: "AI enrichment coming soon!" });
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Message Updated!",
      description: `Your message to ${contacts.find(c => c.id === values.contactId)?.name} has been updated.`,
    });
  };

  if (!message) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading message...</p>
        </div>
    );
  }

  return (
    <div>
       <div className="mb-8">
        <Button asChild variant="outline" size="sm">
            <Link href="/scheduled">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scheduled
            </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-headline tracking-tight text-center">
          Edit Scheduled Message
        </h1>
        <div/>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Update the details for your scheduled message.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="contactId"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Contact</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a contact" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {contacts.map((contact) => (
                                        <SelectItem key={contact.id} value={contact.id}>
                                        {contact.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Content</FormLabel>
                                    <Button type="button" variant="ghost" size="sm" onClick={handleAiEnrich} disabled={isAiLoading}>
                                    {isAiLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    Enrich with AI
                                    </Button>
                                </div>
                                <FormControl>
                                    <Textarea
                                    placeholder="Write your personal message here..."
                                    className="min-h-[150px] resize-y"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="scheduledAtDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                    <FormLabel>Schedule Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            </Button>
                                        </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date(new Date().setHours(0,0,0,0))
                                            }
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="scheduledAtTime"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Schedule Time</FormLabel>
                                    <FormControl>
                                         <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="time" className="pl-10" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Send className="mr-2 h-4 w-4" />
                            Update Message
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
