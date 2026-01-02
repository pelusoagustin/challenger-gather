export type NotificationRecord = {
  recipient: string;
  message: string;
  channel: string;
  timestamp: string;
};

const history: NotificationRecord[] = [];

export const addNotificationRecord = (record: NotificationRecord): void => {
  history.push(record);
};

export const getNotificationHistory = (): NotificationRecord[] => [...history];
