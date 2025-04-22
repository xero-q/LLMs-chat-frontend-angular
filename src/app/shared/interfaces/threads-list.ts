import { Thread } from './thread';

export interface ThreadsList {
  date: string;
  threads: Thread[];
}

export interface PaginatedThreadsList {
  current_page: number;
  has_next: boolean;
  results: ThreadsList[];
}
