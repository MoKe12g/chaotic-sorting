import { DatabaseRelation } from './database-relation';

export interface StorageBox extends DatabaseRelation {
  place: string;
}
