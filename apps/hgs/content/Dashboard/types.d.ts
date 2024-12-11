import { MessageTypes } from '@/types/General';

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

export type UserMessageProps = {
    message: MessageContent,
    showDivider?: boolean,
    deleteMessageHandler: (objectId: string) => void,
    setMessageToRead: (objectId: string) => void
}