"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Clock, Send, Sparkles, Loader2, UserPlus } from 'lucide-react';
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
import type { Contact } from '@/lib/types';
import Link from 'next/link';

const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

const formSchema = z.object({
  contactId: z.string().min(1, 'Please select a contact.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  scheduledAtDate: z.date({ required_error: "Please select a date." }),
  scheduledAtTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
});

export default function FreestyleSchedulePage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactId: '',
      content: '',
      scheduledAtTime: '09:00',
    },
  });

  const contentValue = form.watch('content');

  const handleAiEnrich = async () => {
    // Placeholder for AI enrichment
    toast({ title: "AI enrichment coming soon!" });
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Message Scheduled!",
      description: `Your message to ${contacts.find(c => c.id === values.contactId)?.name} has been scheduled.`,
    });
    // Here you would typically redirect or clear the form
    // router.push('/scheduled');
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold font-headline tracking-tight text-center">
          Freestyle Message
        </h1>
        <div/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Schedule a personal message for a specific contact.</CardDescription>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            Schedule Message
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
                              <p className="text-sm whitespace-pre-wrap">{contentValue || "Your message will appear here..."}</p>
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
