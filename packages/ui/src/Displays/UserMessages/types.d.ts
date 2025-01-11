import { MessageTypes } from '@/types/General';
import { Notification } from '@repo/types';

export type MessageContent = {
    objectId: MessageTypes.Message['objectId']
    type: MessageTypes.MessageTypes,
    createdAt: MessageTypes.Message['createdAt'],
    headline: string,
    content: string,
    link: string,
    time: string,
    is_read: MessageTypes.Message['is_read']
}

export type UserMessagesProps = {
    userMessages: MessageTypes.Message[],
    refetchMessages: () => void
}

export type RenderNotificationProps = Notification & {deleteNotification: (id: number | string) => void}

