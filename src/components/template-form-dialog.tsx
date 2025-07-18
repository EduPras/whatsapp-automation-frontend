"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Template } from '@/lib/types';
import { enrichTemplateContent } from '@/ai/flows/template-content-enrichment';
import { useToast } from "@/hooks/use-toast";

interface TemplateFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  template: Template | null;
  onSave: (data: Omit<Template, 'id' | 'createdAt'>) => void;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
});

export function TemplateFormDialog({
  isOpen,
  onOpenChange,
  template,
  onSave,
}: TemplateFormDialogProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const contentValue = form.watch('content');

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: template?.title || '',
        content: template?.content || '',
      });
    }
  }, [isOpen, template, form]);

  const handleAiEnrich = async () => {
    const currentContent = form.getValues('content');
    if (!currentContent) {
      toast({
        variant: "destructive",
        title: "Content is empty",
        description: "Please write some content before using AI enrichment.",
      });
      return;
    }

    setIsAiLoading(true);
    try {
      const result = await enrichTemplateContent({ templateContent: currentContent });
      form.setValue('content', result.enrichedContent, { shouldValidate: true });
    } catch (error) {
      console.error('AI enrichment failed:', error);
      toast({
        variant: "destructive",
        title: "AI enrichment failed",
        description: "Could not enrich content. Please try again.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid-cols-1 sm:grid-cols-2 gap-0 p-0">
        <div className="p-6 md:p-8 flex flex-col h-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">
              {template ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {template
                ? 'Make changes to your template.'
                : 'Fill in the details to create a new message template.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow mt-6">
              <div className="space-y-4 flex-grow">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Welcome Message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex flex-col flex-grow">
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
                          placeholder="Write your message here. Use {{variable}} for placeholders."
                          className="min-h-[200px] resize-y flex-grow"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="pt-4 !mt-auto">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Template</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
        <div className="bg-secondary/50 hidden sm:flex flex-col items-center justify-center p-8 rounded-r-lg">
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
      </DialogContent>
    </Dialog>
  );
}
