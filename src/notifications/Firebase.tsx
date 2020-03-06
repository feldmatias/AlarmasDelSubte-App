import firebase from 'react-native-firebase';

export const PUSH_NOTIFICATIONS_DI = 'PUSH_NOTIFICATIONS_DI';
export type PushNotifications = typeof firebase;
export const PushNotificationsInstance = firebase;
