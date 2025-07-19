
import type { Template, Folder, Contact, ScheduledMessage } from './types';

// In-memory data store to simulate a database
let folders: Folder[] = [
  { id: '1', name: 'Marketing' },
  { id: '2', name: 'Appointment Reminders' },
  { id: '3', name: 'General' },
];

let templates: Template[] = [
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

let contacts: Contact[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', avatarUrl: 'https://placehold.co/40x40.png' },
];

let scheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    contacts: [contacts[0]],
    content: 'Hi Alice, just a reminder about our meeting tomorrow at 10 AM. See you then!',
    scheduledAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    status: 'scheduled',
  },
  {
    id: '2',
    contacts: [contacts[1]],
    content: 'Hey Bob, did you get a chance to look at the proposal? Let me know your thoughts.',
    scheduledAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    status: 'scheduled',
    templateId: '2',
  },
  {
    id: '3',
    contacts: [contacts[0]],
    content: 'Welcome aboard, Alice! We are thrilled to have you.',
    scheduledAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'sent',
    templateId: '1',
  },
   {
    id: '4',
    contacts: [contacts[0], contacts[1], contacts[2]],
    content: 'Hi team, project update meeting is scheduled for Friday. Please confirm your availability.',
    scheduledAt: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    status: 'scheduled',
  },
];

// Simulate API latency
const simulateLatency = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// FOLDERS API
export const getFolders = async (): Promise<Folder[]> => {
    await simulateLatency();
    return [...folders];
};

export const addFolder = async (name: string): Promise<Folder> => {
    await simulateLatency();
    const newFolder: Folder = { id: Date.now().toString(), name };
    folders = [...folders, newFolder];
    return newFolder;
};

export const deleteFolder = async (id: string): Promise<void> => {
    await simulateLatency();
    const folderToDelete = folders.find(f => f.id === id);
    if (folderToDelete) {
        // Un-assign templates from the deleted folder
        templates = templates.map(t => t.folder === folderToDelete.name ? { ...t, folder: 'General' } : t);
    }
    folders = folders.filter(f => f.id !== id);
};

// TEMPLATES API
export const getTemplates = async (): Promise<Template[]> => {
    await simulateLatency();
    return [...templates].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getTemplateById = async (id: string): Promise<Template | undefined> => {
    await simulateLatency();
    return templates.find(t => t.id === id);
};

export const saveTemplate = async (templateData: Omit<Template, 'id' | 'createdAt'>, id?: string): Promise<Template> => {
    await simulateLatency();
    if (id) {
        let updatedTemplate: Template | undefined;
        templates = templates.map(t => {
            if (t.id === id) {
                updatedTemplate = { ...t, ...templateData };
                return updatedTemplate;
            }
            return t;
        });
        if (!updatedTemplate) throw new Error("Template not found");
        return updatedTemplate;
    } else {
        const newTemplate: Template = {
            id: Date.now().toString(),
            createdAt: new Date(),
            ...templateData,
        };
        templates = [newTemplate, ...templates];
        return newTemplate;
    }
};

export const deleteTemplate = async (id: string): Promise<void> => {
    await simulateLatency();
    templates = templates.filter(t => t.id !== id);
};

// CONTACTS API
export const getContacts = async (): Promise<Contact[]> => {
    await simulateLatency();
    return [...contacts];
};

// SCHEDULED MESSAGES API
export const getScheduledMessages = async (): Promise<ScheduledMessage[]> => {
    await simulateLatency();
    return [...scheduledMessages].sort((a,b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
};

export const getScheduledMessageById = async (id: string): Promise<ScheduledMessage | undefined> => {
    await simulateLatency();
    return scheduledMessages.find(m => m.id === id);
};

export const scheduleMessage = async (messageData: Omit<ScheduledMessage, 'id' | 'status'>): Promise<ScheduledMessage> => {
    await simulateLatency();
    const newMessage: ScheduledMessage = {
        id: Date.now().toString(),
        status: 'scheduled',
        ...messageData,
    };
    scheduledMessages = [newMessage, ...scheduledMessages];
    return newMessage;
};

export const updateScheduledMessage = async (id: string, messageData: Omit<ScheduledMessage, 'id' | 'status'>): Promise<ScheduledMessage> => {
    await simulateLatency();
    let updatedMessage: ScheduledMessage | undefined;
    scheduledMessages = scheduledMessages.map(m => {
        if (m.id === id) {
            updatedMessage = { ...m, ...messageData };
            return updatedMessage;
        }
        return m;
    });
    if (!updatedMessage) throw new Error("Scheduled message not found");
    return updatedMessage;
};

export const deleteScheduledMessage = async (id: string): Promise<void> => {
    await simulateLatency();
    scheduledMessages = scheduledMessages.filter(m => m.id !== id);
};
