
"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircle, MessageSquareText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateCard } from '@/components/template-card';
import { TemplateFormDialog } from '@/components/template-form-dialog';
import type { Template } from '@/lib/types';
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
import { useTranslations } from 'next-intl';
import { useData } from '@/lib/data-provider';


export default function TemplatesPage() {
  const searchParams = useSearchParams();
  const folderParam = searchParams.get('folder');
  const t = useTranslations('TemplatesPage');
  const tSidebar = useTranslations('Sidebar');
  const tButtons = useTranslations('Buttons');
  
  const { folders, templates, deleteTemplate, isLoading } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  
  const getActiveFolderName = () => {
    if (!folderParam) return tSidebar('allTemplates');
    if (folderParam === 'Appointment Reminders') return tSidebar('appointmentReminders');
    return folderParam;
  }

  const activeFolder = folderParam || 'All Templates';
  const activeFolderName = getActiveFolderName();

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
  };

  const handleDeleteConfirm = async () => {
    if (templateToDelete) {
      await deleteTemplate(templateToDelete);
      setTemplateToDelete(null);
    }
  };

  const filteredTemplates = activeFolder === 'All Templates'
    ? templates
    : templates.filter(t => t.folder === activeFolder);
    
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            {activeFolderName}
          </h1>
          <Button onClick={handleCreateNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('createTemplate')}
          </Button>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t('noTemplatesInFolder')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('getStarted')}
            </p>
            <div className="mt-6">
               <Button onClick={handleCreateNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('createTemplate')}
              </Button>
            </div>
          </div>
        )}
      
      <TemplateFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        template={selectedTemplate}
        onClose={() => setIsFormOpen(false)}
        activeFolder={activeFolder}
      />

      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteTemplateTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteTemplateDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>{tButtons('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              {tButtons('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
