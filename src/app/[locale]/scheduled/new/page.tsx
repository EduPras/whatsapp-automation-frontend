
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Clock, Send, Sparkles, Loader2, Users, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import type { ScheduledMessage } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useData } from '@/lib/data-provider';

export default function FreestyleSchedulePage() {
  const { contacts, scheduleMessage } = useData();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const t = useTranslations('FreestyleMessagePage');
  const tForm = useTranslations('ScheduleForm');
  const tToast = useTranslations('Toast');
  const tContent = useTranslations('TemplateFormDialog');
  const tContacts = useTranslations('ScheduleFromTemplatePage');

  const formSchema = z.object({
    contactIds: z.array(z.string()).nonempty({ message: tForm('selectContactsError') }),
    content: z.string().min(10, { message: tForm('contentError') }),
    scheduledAtDate: z.date({ required_error: tForm('dateError') }),
    scheduledAtTime: z.string().regex(/^([01]\d|2[0-3])\s?:\s?([0-5]\d)$/, { message: tForm('timeError') }),
  });

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

  const handleAiEnrich = async () => {
    toast({ title: "AI enrichment coming soon!" });
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { scheduledAtDate, scheduledAtTime, contactIds, content } = values;
    const [hours, minutes] = scheduledAtTime.replace(/\s/g, '').split(':').map(Number);
    const scheduledAt = new Date(scheduledAtDate);
    scheduledAt.setHours(hours, minutes);

    const messageToSchedule: Omit<ScheduledMessage, 'id' | 'status'> = {
      contacts: contacts.filter(c => contactIds.includes(c.id)),
      content,
      scheduledAt,
    }

    scheduleMessage(messageToSchedule);

    toast({
      title: tToast('messageScheduled'),
      description: tToast('messageScheduledDescription', { count: values.contactIds.length }),
    });
    form.reset();
  };

  return (
      <div>
        <div className="mb-8">
          <Button asChild variant="outline" size="sm">
              <Link href="/scheduled">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('backToScheduled')}
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
                <CardTitle>{t('composeTitle')}</CardTitle>
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
                            {selectedContactsCount > 0 ? t('scheduleForContacts', {count: selectedContactsCount}) : t('scheduleMessage')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
  );
}

