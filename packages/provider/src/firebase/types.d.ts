export type Message = {
  notification: {
      title: string,
      body: string
  },
  data: MessageData,
  tokens: string[]
}

export type MessageData = 
{
  type: 'task_assigned',
  task_id: string,
  task_name: string,
} |
{
  type: 'task_done',
  task_id: string,
  task_name: string,
} |
{
  type: 'task_comment',
  task_id: string,
  task_name: string,
} |
{
  type: 'task_file',
  task_id: string,
  task_name: string,
} |
{
  type: 'ticket_comment',
  ticket_id: string,
  ticket_name: string,
} |
{
  type: 'ticket_file',
  ticket_id: string,
  ticket_name: string,
}

export type SendMessage = ({notification, data, tokens}: Message) => Promise<void>

export type NotificationSettings = {
  'task_assigned': boolean,
  'task_done': boolean,
  'task_comment': boolean,
  'task_file': boolean,
  'ticket_comment': boolean,
  'ticket_file': boolean
}