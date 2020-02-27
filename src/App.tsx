import 'react-native-gesture-handler';
import 'reflect-metadata';
import React from 'react';
import AppContainer from './screens/AppNavigator';
import firebase from 'react-native-firebase';
import {Notification} from 'react-native-firebase/notifications';
import {strings} from './strings/Strings';


export default class App extends React.Component {

    private readonly NOTIFICATIONS_CHANNEL_ID = 'notifications';

    private removeNotificationListener?: () => any;

    private async checkNotificationPermissions(): Promise<void> {
        const notificationsEnabled = await firebase.messaging().hasPermission();
        if (!notificationsEnabled) {
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
            } catch (error) {
                // User has rejected permissions
                console.log(error);
            }
        }
    }

    private async createNotificationsChannel(): Promise<void> {
        const channel = new firebase.notifications.Android.Channel(this.NOTIFICATIONS_CHANNEL_ID, strings.appName, firebase.notifications.Android.Importance.Max)
            .setDescription(strings.notificationsChannelDescription);

        await firebase.notifications().android.createChannel(channel);
    }

    private handleForegroundNotifications(): void {
        this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            notification.android.setChannelId(this.NOTIFICATIONS_CHANNEL_ID);
            notification.android.setAutoCancel(true);
            firebase.notifications().displayNotification(notification);
        });
    }

    public async componentDidMount() {
        await this.checkNotificationPermissions();
        await this.createNotificationsChannel();
        this.handleForegroundNotifications();
    }

    public componentWillUnmount() {
        if (this.removeNotificationListener) {
            this.removeNotificationListener();
        }
    }

    public render() {
        return <AppContainer/>;
    }
}
