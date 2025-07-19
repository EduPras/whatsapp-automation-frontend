
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Template, Folder, Contact, ScheduledMessage } from './types';
import * as api from './api';
import { Loader2 } from 'lucide-react';

// Data Context
interface DataContextType {
    folders: Folder[];
    templates: Template[];
    contacts: Contact[];
    scheduledMessages: ScheduledMessage[];
    addFolder: (name: string) => Promise<void>;
    deleteFolder: (id: string) => Promise<void>;
    saveTemplate: (templateData: Omit<Template, 'id' | 'createdAt'>, id?: string) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
    getTemplateById: (id: string) => Template | undefined;
    scheduleMessage: (messageData: Omit<ScheduledMessage, 'id' | 'status'>) => Promise<void>;
    updateScheduledMessage: (id: string, messageData: Omit<ScheduledMessage, 'id' | 'status'>) => Promise<void>;
    deleteScheduledMessage: (id: string) => Promise<void>;
    getScheduledMessageById: (id: string) => ScheduledMessage | undefined;
    isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [foldersData, templatesData, contactsData, messagesData] = await Promise.all([
                api.getFolders(),
                api.getTemplates(),
                api.getContacts(),
                api.getScheduledMessages(),
            ]);
            setFolders(foldersData);
            setTemplates(templatesData);
            setContacts(contactsData);
            setScheduledMessages(messagesData);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addFolder = async (name: string) => {
        await api.addFolder(name);
        setFolders(await api.getFolders());
    };

    const deleteFolder = async (id: string) => {
        await api.deleteFolder(id);
        const [newFolders, newTemplates] = await Promise.all([
            api.getFolders(),
            api.getTemplates(),
        ]);
        setFolders(newFolders);
        setTemplates(newTemplates);
    };

    const saveTemplate = async (templateData: Omit<Template, 'id' | 'createdAt'>, id?: string) => {
        await api.saveTemplate(templateData, id);
        setTemplates(await api.getTemplates());
    };

    const deleteTemplate = async (id: string) => {
        await api.deleteTemplate(id);
        setTemplates(await api.getTemplates());
    };

    const getTemplateById = (id: string) => {
        return templates.find(t => t.id === id);
    }
    
    const scheduleMessage = async (messageData: Omit<ScheduledMessage, 'id'|'status'>) => {
        await api.scheduleMessage(messageData);
        setScheduledMessages(await api.getScheduledMessages());
    }

    const updateScheduledMessage = async (id: string, messageData: Omit<ScheduledMessage, 'id'|'status'>) => {
        await api.updateScheduledMessage(id, messageData);
        setScheduledMessages(await api.getScheduledMessages());
    }

    const deleteScheduledMessage = async (id: string) => {
        await api.deleteScheduledMessage(id);
        setScheduledMessages(await api.getScheduledMessages());
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
            getScheduledMessageById,
            isLoading
        }}>
            {isLoading ? (
                 <div className="flex h-screen w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
            ) : children}
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
