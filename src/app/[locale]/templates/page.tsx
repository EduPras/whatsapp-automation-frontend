
"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlusCircle, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateCard } from '@/components/template-card';
import { TemplateFormDialog } from '@/components/template-form-dialog';
import type { Template, Folder as FolderType } from '@/lib/types';
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


const initialFolders: FolderType[] = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Appointment Reminders' },
  { id: '3', name: 'General' },
];

const initialTemplates: Template[] = [
  {
    id: '1',
    title: 'Welcome Message',
    content: 'Hi {{client_name}}, welcome to our service! We are excited to have you on board. Let us know if you have any questions.',
    createdAt: new Date('2023-10-26T10:00:00Z'),
    folder: 'General',
  },
  {
    id: '2',
    title: 'Appointment Reminder',
    content: 'Hi {{client_name}}, this is a reminder for your appointment tomorrow at \'{{appointment_time}}\'. We look forward to seeing you!',
    createdAt: new Date('2023-10-25T15:30:00Z'),
    folder: 'Appointment Reminders',
  },
  {
    id: '3',
    title: 'Promotional Offer',
    content: 'Hi {{client_name}}, we have a special offer for you! Get 20% off on your next purchase with the code PROMO20. Don\'t miss out!',
    createdAt: new Date('2023-10-24T11:00:00Z'),
    folder: 'Marketing',
  },
  {
    id: '4',
    title: 'Follow-up',
    content: 'Hi {{client_name}}, just following up on our last conversation. Let me know if you need anything else.',
    createdAt: new Date('2023-10-23T11:00:00Z'),
    folder: 'General',
  },
];

export default function TemplatesPage() {
  const searchParams = useSearchParams();
  const folderParam = searchParams.get('folder');
  const t = useTranslations('TemplatesPage');
  const tSidebar = useTranslations('Sidebar');
  const tButtons = useTranslations('Buttons');
  
  const [folders] = useState<FolderType[]>(initialFolders);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
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

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      setTemplates(templates.filter(t => t.id !== templateToDelete));
      setTemplateToDelete(null);
    }
  };

  const handleSaveTemplate = (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    if (selectedTemplate) {
      setTemplates(templates.map(t =>
        t.id === selectedTemplate.id ? { ...selectedTemplate, ...templateData } : t
      ));
    } else {
      const newTemplate: Template = {
        id: (templates.length + 1).toString(),
        createdAt: new Date(),
        ...templateData,
      };
      setTemplates([newTemplate, ...templates]);
    }
    setIsFormOpen(false);
  };

  const filteredTemplates = activeFolder === 'All Templates'
    ? templates
    : templates.filter(t => t.folder === activeFolder);

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
        onSave={handleSaveTemplate}
        folders={folders}
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
