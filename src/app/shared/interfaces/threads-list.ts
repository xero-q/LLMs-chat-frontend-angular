import { Thread } from './thread';

export interface ThreadsList {
  date: string;
  threads: Thread[];
}

export interface PaginatedThreadsList {
  currentPage: number;
  hasNext: boolean;
  results: ThreadsList[];
}
