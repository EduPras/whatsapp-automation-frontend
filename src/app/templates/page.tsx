"use client";

import { useState } from 'react';
import { PlusCircle, MessageSquareText, FolderPlus, Inbox, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TemplateCard } from '@/components/template-card';
import { TemplateFormDialog } from '@/components/template-form-dialog';
import type { Template, Folder as FolderType } from '@/lib/types';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const initialFolders: FolderType[] = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Appointments' },
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
    content: 'Hi {{client_name}}, this is a reminder for your appointment tomorrow at {{appointment_time}}. We look forward to seeing you!',
    createdAt: new Date('2023-10-25T15:30:00Z'),
    folder: 'Appointments',
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
  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeFolder, setActiveFolder] = useState<string>('All');

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsFormOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
  };

  const handleSaveFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderType = {
        id: (folders.length + 1).toString(),
        name: newFolderName.trim(),
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setIsFolderFormOpen(false);
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

  const filteredTemplates = activeFolder === 'All'
    ? templates
    : templates.filter(t => t.folder === activeFolder);

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsFolderFormOpen(true)}>
            <FolderPlus />
            <span className="group-data-[collapsible=icon]:hidden">New Folder</span>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveFolder('All')} isActive={activeFolder === 'All'} tooltip="All Templates">
                <Inbox />
                All Templates
              </SidebarMenuButton>
            </SidebarMenuItem>
            {folders.map(folder => (
              <SidebarMenuItem key={folder.id}>
                <SidebarMenuButton onClick={() => setActiveFolder(folder.name)} isActive={activeFolder === folder.name} tooltip={folder.name}>
                  <Folder />
                  {folder.name}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
              {activeFolder}
            </h1>
            <Button onClick={handleCreateNew} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No templates in this folder</h3>
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
        </div>
      </SidebarInset>

      <TemplateFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
        folders={folders.map(f => f.name)}
        activeFolder={activeFolder}
      />

      <Dialog open={isFolderFormOpen} onOpenChange={setIsFolderFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFolderFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveFolder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
