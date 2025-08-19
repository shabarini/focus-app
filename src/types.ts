export type Section = 'today' | 'todo' | 'done';

export interface Task {
  id: number;
  text: string;
  notes?: string;
  project?: string;
  projectColor?: string;
  tags?: string[];
  files?: Array<{
    id: number;
    name: string;
    type: string;
    size: number;
  }>;
  createdAt: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface ArchiveItem {
  month: string;
  tasks: Task[];
}

