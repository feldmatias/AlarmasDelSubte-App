import {strings} from '../strings/Strings';
import {Notification} from 'react-native-firebase/notifications';
import {inject, injectable} from 'inversify';
import {PushNotifications, PUSH_NOTIFICATIONS_DI} from './Firebase';
import firebase from 'react-native-firebase';

@injectable()
export class PushNotificationsService {

    private readonly NOTIFICATIONS_CHANNEL_ID = 'notifications';
    private readonly NOTIFICATIONS_ICON = 'ic_notification';

    @inject(PUSH_NOTIFICATIONS_DI) private pushNotifications!: PushNotifications;

    private removeNotificationListener?: () => any;

    private async checkNotificationPermissions(): Promise<void> {
        const notificationsEnabled = await this.pushNotifications.messaging().hasPermission();
        if (!notificationsEnabled) {
            try {
                await this.pushNotifications.messaging().requestPermission();
                // User has authorised
            } catch (error) {
                // User has rejected permissions
                console.log(error);
            }
        }
    }

    private async createNotificationsChannel(): Promise<void> {
        const channel = new firebase.notifications.Android.Channel(
            this.NOTIFICATIONS_CHANNEL_ID,
            strings.appName,
            firebase.notifications.Android.Importance.Max)
            .setDescription(strings.notificationsChannelDescription);

        await this.pushNotifications.notifications().android.createChannel(channel);
    }

    private handleForegroundNotifications(): void {
        this.removeNotificationListener = this.pushNotifications.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            notification.android.setChannelId(this.NOTIFICATIONS_CHANNEL_ID);
            notification.android.setAutoCancel(true);
            notification.android.setSmallIcon(this.NOTIFICATIONS_ICON);
            this.pushNotifications.notifications().displayNotification(notification);
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
