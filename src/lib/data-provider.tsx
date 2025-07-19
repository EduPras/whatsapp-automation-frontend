
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Template, Folder, Contact, ScheduledMessage } from './types';

// Initial Data (Hardcoded for now)
const initialFolders: Folder[] = [
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

const initialContacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

const initialScheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    contacts: [initialContacts[0]],
    content: 'Hi Alice, just a reminder about our meeting tomorrow at 10 AM. See you then!',
    scheduledAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'scheduled',
  },
  {
    id: '2',
    contacts: [initialContacts[1]],
    content: 'Hey Bob, did you get a chance to look at the proposal? Let me know your thoughts.',
    scheduledAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    status: 'scheduled',
    templateId: '2',
  },
  {
    id: '3',
    contacts: [initialContacts[0]],
    content: 'Welcome aboard, Alice! We are thrilled to have you.',
    scheduledAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'sent',
    templateId: '1',
  },
   {
    id: '4',
    contacts: [initialContacts[0], initialContacts[1], initialContacts[2]],
    content: 'Hi team, project update meeting is scheduled for Friday. Please confirm your availability.',
    scheduledAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    status: 'scheduled',
  },
];


// Data Context
interface DataContextType {
    folders: Folder[];
    templates: Template[];
    contacts: Contact[];
    scheduledMessages: ScheduledMessage[];
    addFolder: (name: string) => void;
    deleteFolder: (id: string) => void;
    saveTemplate: (templateData: Omit<Template, 'id' | 'createdAt'>, id?: string) => void;
    deleteTemplate: (id: string) => void;
    getTemplateById: (id: string) => Template | undefined;
    scheduleMessage: (messageData: Omit<ScheduledMessage, 'id' | 'status'>) => void;
    updateScheduledMessage: (id: string, messageData: Omit<ScheduledMessage, 'id' | 'status'>) => void;
    deleteScheduledMessage: (id: string) => void;
    getScheduledMessageById: (id: string) => ScheduledMessage | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [contacts] = useState<Contact[]>(initialContacts);
    const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(initialScheduledMessages);

    const addFolder = (name: string) => {
        const newFolder: Folder = { id: Date.now().toString(), name };
        setFolders(prev => [...prev, newFolder]);
    };

    const deleteFolder = (id: string) => {
        setFolders(prev => prev.filter(f => f.id !== id));
        // Un-assign templates from the deleted folder
        setTemplates(prev => prev.map(t => t.folder === folders.find(f => f.id === id)?.name ? { ...t, folder: 'General' } : t));
    };

    const saveTemplate = (templateData: Omit<Template, 'id' | 'createdAt'>, id?: string) => {
        if (id) {
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...templateData } : t));
        } else {
            const newTemplate: Template = {
                id: Date.now().toString(),
                createdAt: new Date(),
                ...templateData,
            };
            setTemplates(prev => [newTemplate, ...prev]);
        }
    };

    const deleteTemplate = (id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    const getTemplateById = (id: string) => {
        return templates.find(t => t.id === id);
    }
    
    const scheduleMessage = (messageData: Omit<ScheduledMessage, 'id'|'status'>) => {
        const newMessage: ScheduledMessage = {
            id: Date.now().toString(),
            status: 'scheduled',
            ...messageData,
        };
        setScheduledMessages(prev => [newMessage, ...prev]);
    }

    const updateScheduledMessage = (id: string, messageData: Omit<ScheduledMessage, 'id'|'status'>) => {
        setScheduledMessages(prev => prev.map(m => m.id === id ? { ...m, ...messageData } : m));
    }

    const deleteScheduledMessage = (id: string) => {
        setScheduledMessages(prev => prev.filter(m => m.id !== id));
    }
    
    const getScheduledMessageById = (id: string) => {
        return scheduledMessages.find(m => m.id === id);
    }


    return (
        <DataContext.Provider value={{
            folders,
            templates,
            contacts,
            scheduledMessages,
            addFolder,
            deleteFolder,
            saveTemplate,
            deleteTemplate,
            getTemplateById,
            scheduleMessage,
            updateScheduledMessage,
            deleteScheduledMessage,
            getScheduledMessageById
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
