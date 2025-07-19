
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Clock, Send, Sparkles, Loader2, ArrowLeft, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';


const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

const initialScheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    contacts: [initialContacts[0]],
    content: 'Hi Alice, just a reminder about our meeting tomorrow at 10 AM. See you then!',
    scheduledAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    status: 'scheduled',
  },
  {
    id: '2',
    contacts: [initialContacts[1]],
    content: 'Hey Bob, did you get a chance to look at the proposal? Let me know your thoughts.',
    scheduledAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    templateId: '2',
  },
  {
    id: '4',
    contacts: [initialContacts[0], initialContacts[1], initialContacts[2]],
    content: 'Hi team, project update meeting is scheduled for Friday. Please confirm your availability.',
    scheduledAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
  },
];


const formSchema = z.object({
  contactIds: z.array(z.string()).nonempty({ message: 'Please select at least one contact.' }),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  scheduledAtDate: z.date({ required_error: "Please select a date." }),
  scheduledAtTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
});

export default function EditScheduledMessagePage() {
  const params = useParams();
  const id = params.id as string;
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [message, setMessage] = useState<ScheduledMessage | null>(null);
  const [contacts] = useState<Contact[]>(initialContacts);
  const { toast } = useToast();
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const t = useTranslations('EditScheduledMessagePage');
  const tFreestyle = useTranslations('FreestyleMessagePage');
  const tForm = useTranslations('ScheduleForm');
  const tToast = useTranslations('Toast');
  const tContent = useTranslations('TemplateFormDialog');
  const tContacts = useTranslations('ScheduleFromTemplatePage');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactIds: [],
      content: '',
      scheduledAtTime: '09:00',
    },
  });
  
  const selectedContactsCount = form.watch('contactIds').length;

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchTerm.toLowerCase())
  );

  useEffect(() => {
    if (id) {
        const messageToEdit = initialScheduledMessages.find(m => m.id === id);
        if (messageToEdit) {
            setMessage(messageToEdit);
            form.reset({
                contactIds: messageToEdit.contacts.map(c => c.id),
                content: messageToEdit.content,
                scheduledAtDate: messageToEdit.scheduledAt,
                scheduledAtTime: format(messageToEdit.scheduledAt, 'HH:mm'),
            });
        }
    }
  }, [id, form]);

  const handleAiEnrich = async () => {
    toast({ title: "AI enrichment coming soon!" });
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Override zod validation messages with translated ones
    const validation = z.object({
        contactIds: z.array(z.string()).nonempty({ message: tForm('selectContactsError') }),
        content: z.string().min(10, tForm('contentError')),
        scheduledAtDate: z.date({ required_error: tForm('dateError') }),
        scheduledAtTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, tForm('timeError')),
    }).safeParse(values);

    if (!validation.success) {
        form.setError('contactIds', { message: validation.error.formErrors.fieldErrors.contactIds?.join(', ') });
        form.setError('content', { message: validation.error.formErrors.fieldErrors.content?.join(', ') });
        form.setError('scheduledAtDate', { message: validation.error.formErrors.fieldErrors.scheduledAtDate?.join(', ') });
        form.setError('scheduledAtTime', { message: validation.error.formErrors.fieldErrors.scheduledAtTime?.join(', ') });
        return;
    }

    console.log(values);
    toast({
      title: tToast('messageUpdated'),
      description: tToast('messageUpdatedDescription'),
    });
  };

  if (!message) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">{useTranslations('General')('loading')}</p>
        </div>
    );
  }

  return (
    <div>
       <div className="mb-8">
        <Button asChild variant="outline" size="sm">
            <Link href="/scheduled">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tFreestyle('backToScheduled')}
            </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-headline tracking-tight text-center">
          {t('title')}
        </h1>
        <div/>
      </div>

        <Card>
            <CardHeader>
                <CardTitle>{tFreestyle('composeTitle')}</CardTitle>
                <CardDescription>{t('composeDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="contactIds"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base flex items-center gap-2"><Users/> {tContacts('contactsLabel')}</FormLabel>
                                        <FormDescription>
                                        {tContacts('contactsDescription')}
                                        </FormDescription>
                                    </div>
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            placeholder={tForm('searchContactsPlaceholder')}
                                            className="pl-10" 
                                            value={contactSearchTerm}
                                            onChange={(e) => setContactSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2 border rounded-md">
                                    {filteredContacts.map((item) => (
                                        <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="contactIds"
                                        render={({ field }) => {
                                            return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), item.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                            (value) => value !== item.id
                                                            )
                                                        )
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                {item.name}
                                                </FormLabel>
                                            </FormItem>
                                            )
                                        }}
                                        />
                                    ))}
                                    </div>
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
                                    <FormLabel>{tContent('contentLabel')}</FormLabel>
                                    <Button type="button" variant="ghost" size="sm" onClick={handleAiEnrich} disabled={isAiLoading}>
                                    {isAiLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    {tContent('enrichWithAI')}
                                    </Button>
                                </div>
                                <FormControl>
                                    <Textarea
                                    placeholder={tContent('contentPlaceholder')}
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
                                    <FormItem>
                                    <FormLabel>{tForm('dateLabel')}</FormLabel>
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
                                                <span>{tForm('datePlaceholder')}</span>
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
                                    <FormLabel>{tForm('timeLabel')}</FormLabel>
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

                         <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={selectedContactsCount === 0}>
                            <Send className="mr-2 h-4 w-4" />
                            {t('updateMessage')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
