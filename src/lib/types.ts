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
