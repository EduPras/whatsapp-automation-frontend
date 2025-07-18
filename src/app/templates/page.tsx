"use client";

import { useState } from 'react';
import { PlusCircle, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateCard } from '@/components/template-card';
import { TemplateFormDialog } from '@/components/template-form-dialog';
import type { Template } from '@/lib/types';

const initialTemplates: Template[] = [
  {
    id: '1',
    title: 'Welcome Message',
    content: 'Hi {{client_name}}, welcome to our service! We are excited to have you on board. Let us know if you have any questions.',
    createdAt: new Date('2023-10-26T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Appointment Reminder',
    content: 'Hi {{client_name}}, this is a reminder for your appointment tomorrow at {{appointment_time}}. We look forward to seeing you!',
    createdAt: new Date('2023-10-25T15:30:00Z'),
  },
  {
    id: '3',
    title: 'Promotional Offer',
    content: 'Hi {{client_name}}, we have a special offer for you! Get 20% off on your next purchase with the code PROMO20. Don\'t miss out!',
    createdAt: new Date('2023-10-24T11:00:00Z'),
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleSave = (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    if (selectedTemplate) {
      // Update existing template
      setTemplates(templates.map(t =>
        t.id === selectedTemplate.id ? { ...selectedTemplate, ...templateData } : t
      ));
    } else {
      // Create new template
      const newTemplate: Template = {
        id: (templates.length + 1).toString(),
        createdAt: new Date(),
        ...templateData,
      };
      setTemplates([newTemplate, ...templates]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Your Templates</h1>
        <Button onClick={handleCreateNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {templates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <TemplateCard key={template.id} template={template} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No templates yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new message template.
          </p>
          <div className="mt-6">
             <Button onClick={handleCreateNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Template
            </Button>
          </div>
        </div>
      )}

      <TemplateFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        template={selectedTemplate}
        onSave={handleSave}
      />
    </div>
  );
}
