
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Clock, Send, Loader2, Users, FileText } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import type { Contact, Template } from '@/lib/types';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

const initialTemplates: Template[] = [
    { id: '1', title: 'Welcome Message', content: 'Hi {{client_name}}, welcome!', createdAt: new Date(), folder: 'General' },
    { id: '2', title: 'Appointment Reminder', content: 'Reminder for {{appointment_time}}.', createdAt: new Date(), folder: 'Appointment Reminders' }
];

const formSchema = z.object({
  contactIds: z.array(z.string()).nonempty({ message: 'Please select at least one contact.' }),
  scheduledAtDate: z.date({ required_error: "Please select a date." }),
  scheduledAtTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
});

export default function ScheduleFromTemplatePage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const [template, setTemplate] = useState<Template | null>(null);
  const [contacts] = useState<Contact[]>(initialContacts);
  const { toast } = useToast();

  useEffect(() => {
    if (templateId) {
      const foundTemplate = initialTemplates.find(t => t.id === templateId);
      setTemplate(foundTemplate || null);
    }
  }, [templateId]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactIds: [],
      scheduledAtTime: '09:00',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Messages Scheduled!",
      description: `Your message has been scheduled for ${values.contactIds.length} contacts.`,
    });
  };

  if (!template) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading template...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-headline tracking-tight text-center">
          Schedule from Template
        </h1>
        <div/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary"/> {template.title}</CardTitle>
                <CardDescription>Schedule this message to be sent to multiple contacts.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Template Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 border rounded-md bg-secondary/50">
                                    <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{template.content}</p>

                                </div>
                            </CardContent>
                        </Card>
                         <FormField
                            control={form.control}
                            name="contactIds"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Contacts</FormLabel>
                                        <FormDescription>
                                        Select the contacts to send this message to.
                                        </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-2 border rounded-md">
                                    {contacts.map((item) => (
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
                            Schedule for {form.getValues('contactIds').length} contacts
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <div className="bg-secondary/50 flex flex-col items-center justify-center p-8 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground font-headline">Message Preview</h3>
            <div className="relative w-full max-w-[280px] h-[560px] bg-black rounded-[40px] border-[10px] border-black shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white p-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-lg"></div>
                    <div className="mt-8 space-y-4">
                      <div className="flex items-end">
                          <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-bl-sm max-w-[80%] break-words">
                              <p className="text-sm whitespace-pre-wrap">{template.content.replace('{{client_name}}', 'Sample Contact') || "Your message will appear here..."}</p>
                          </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
