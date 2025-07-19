
export interface Folder {
  id: string;
  name: string;
}

export interface Template {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  folder: string;
}

export interface Contact {
  id:string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface ScheduledMessage {
  id: string;
  contacts: Contact[];
  content: string;
  scheduledAt: Date;
  status: 'scheduled' | 'sent' | 'failed';
  templateId?: string;
}
