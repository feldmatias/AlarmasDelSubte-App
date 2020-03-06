import firebase from 'react-native-firebase';

const messaging = firebase.messaging();

export const MESSAGING_DI = 'FIREBASE_MESSAGING_DI';
export type MessagingClient = typeof messaging;
export const MessagingInstance = messaging;

const notifications = firebase.notifications();

export const NOTIFICATIONS_DI = 'FIREBASE_NOTIFICATIONS_DI';
export type NotificationsClient = typeof notifications;
export const NotificationsInstance = notifications;

const androidNotifications = firebase.notifications.Android;

export const NOTIFICATIONS_ANDROID_DI = 'FIREBASE_NOTIFICATIONS_ANDROID_DI';
export type NotificationsAndroidModule = typeof androidNotifications;
export const NotificationsAndroidInstance = androidNotifications;
