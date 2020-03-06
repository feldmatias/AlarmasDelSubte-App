import firebase from "react-native-firebase";
import {strings} from "../strings/Strings";
import {Notification} from "react-native-firebase/notifications";

export class PushNotificationsService {

    private readonly NOTIFICATIONS_CHANNEL_ID = 'notifications';
    private readonly NOTIFICATIONS_ICON = 'ic_notification';

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
            notification.android.setSmallIcon(this.NOTIFICATIONS_ICON);
            firebase.notifications().displayNotification(notification);
        });
    }

    public async start() {
        await this.checkNotificationPermissions();
        await this.createNotificationsChannel();
        this.handleForegroundNotifications();
    }

    public stop() {
        if (this.removeNotificationListener) {
            this.removeNotificationListener();
        }
    }
}
