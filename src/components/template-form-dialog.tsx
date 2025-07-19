
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Template } from '@/lib/types';
import { enrichTemplateContent } from '@/ai/flows/template-content-enrichment';
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from 'next-intl';
import { useData } from '@/lib/data-provider';

interface TemplateFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  template: Template | null;
  onClose: () => void;
  activeFolder: string;
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  content: z.string().min(10, 'Content must be at least 10 characters long.'),
  folder: z.string().min(1, 'Please select a folder.'),
});

export function TemplateFormDialog({
  isOpen,
  onOpenChange,
  template,
  onClose,
  activeFolder,
}: TemplateFormDialogProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const t = useTranslations('TemplateFormDialog');
  const tButtons = useTranslations('Buttons');
  const tSidebar = useTranslations('Sidebar');
  const tToast = useTranslations('Toast');
  const { saveTemplate, folders } = useData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      folder: '',
    },
  });

  const contentValue = form.watch('content');
  
  const getFolderName = (name: string) => {
    if (name === 'Appointment Reminders') return tSidebar('appointmentReminders');
    return name;
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: template?.title || '',
        content: template?.content || '',
        folder: template?.folder || (activeFolder !== 'All Templates' ? activeFolder : (folders[0]?.name || ''))
      });
    }
  }, [isOpen, template, form, activeFolder, folders]);

  const handleAiEnrich = async () => {
    const currentContent = form.getValues('content');
    if (!currentContent) {
      toast({
        variant: "destructive",
        title: t('aiEnrichEmptyError'),
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
        title: tToast('aiEnrichFailed'),
        description: tToast('aiEnrichFailedDescription'),
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const validation = z.object({
        title: z.string().min(3, t('titleError')),
        content: z.string().min(10, t('contentError')),
        folder: z.string().min(1, t('folderError')),
    }).safeParse(values);

    if (!validation.success) {
        form.setError('title', { message: validation.error.formErrors.fieldErrors.title?.join(', ') });
        form.setError('content', { message: validation.error.formErrors.fieldErrors.content?.join(', ') });
        form.setError('folder', { message: validation.error.formErrors.fieldErrors.folder?.join(', ') });
        return;
    }
    
    setIsSaving(true);
    await saveTemplate(values, template?.id);
    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid-cols-1 sm:grid-cols-2 gap-0 p-0">
        <div className="p-6 md:p-8 flex flex-col h-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline">
              {template ? t('editTemplate') : t('createTemplate')}
            </DialogTitle>
            <DialogDescription>
              {template
                ? t('editDescription')
                : t('createDescription')}
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
                      <FormLabel>{t('titleLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('titlePlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="folder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('folderLabel')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('folderPlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.name}>
                              {getFolderName(folder.name)}
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
                    <FormItem className="flex flex-col flex-grow">
                      <div className="flex justify-between items-center">
                        <FormLabel>{t('contentLabel')}</FormLabel>
                        <Button type="button" variant="ghost" size="sm" onClick={handleAiEnrich} disabled={isAiLoading || isSaving}>
                          {isAiLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                          )}
                          {t('enrichWithAI')}
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder={t('contentPlaceholder')}
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
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                  {tButtons('cancel')}
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('saveTemplate')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
        <div className="bg-secondary/50 hidden sm:flex flex-col items-center justify-center p-8 rounded-r-lg">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground font-headline">{t('preview')}</h3>
            <div className="relative w-full max-w-[280px] h-[560px] bg-black rounded-[40px] border-[10px] border-black shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-white p-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-lg"></div>
                    <div className="mt-8 space-y-4">
                      <div className="flex items-end">
                          <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-bl-sm max-w-[80%] break-words">
                              <p className="text-sm whitespace-pre-wrap">{contentValue || t('previewPlaceholder')}</p>
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
