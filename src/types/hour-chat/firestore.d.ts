import type { FieldValue, Timestamp } from 'firebase-admin/firestore';

export type BaseStory = {
  body?: string;
  file?: {
    uri: string;
    type?: string | null;
    width?: number;
    height?: number;
  };
  userId: number;
  dislikes: number[];
  likes: number[];
  timestamp: Timestamp;
};

export type MessageData = {
  senderId: number;
  timestamp: Timestamp;
  body: string;
};

export type PrivateMetadata = MessageData & {
  uuid: string; // receiverId
};

export type GroupMetadata = MessageData & {
  name: string;
  uuid: string;
  members: number[] | FieldValue;
};

export type Metadata =
  | {
      typing: number[] | FieldValue;
      timestamp: Timestamp;
    }
  | {
      members: number[] | FieldValue;
      timestamp: Timestamp;
      typing: number[] | FieldValue;
    };
