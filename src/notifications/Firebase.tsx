import firebase from "react-native-firebase";

const messaging = firebase.messaging();

export const MESSAGING_DI = 'FIREBASE_MESSAGING_DI';
export type MessagingClient = typeof messaging;
export const MessagingInstance = messaging;
