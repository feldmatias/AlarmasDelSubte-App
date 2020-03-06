import {strings} from '../strings/Strings';
import {Notification} from 'react-native-firebase/notifications';
import {inject, injectable} from 'inversify';
import {
    MESSAGING_DI,
    MessagingClient,
    NOTIFICATIONS_ANDROID_DI,
    NOTIFICATIONS_DI,
    NotificationsAndroidModule,
    NotificationsClient,
} from './Firebase';

@injectable()
export class PushNotificationsService {

    private readonly NOTIFICATIONS_CHANNEL_ID = 'notifications';
    private readonly NOTIFICATIONS_ICON = 'ic_notification';

    @inject(MESSAGING_DI) private messaging!: MessagingClient;

    @inject(NOTIFICATIONS_DI) private notifications!: NotificationsClient;

    @inject(NOTIFICATIONS_ANDROID_DI) private androidNotifications!: NotificationsAndroidModule;

    private removeNotificationListener?: () => any;

    private async checkNotificationPermissions(): Promise<void> {
        const notificationsEnabled = await this.messaging.hasPermission();
        if (!notificationsEnabled) {
            try {
                await this.messaging.requestPermission();
                // User has authorised
            } catch (error) {
                // User has rejected permissions
                console.log(error);
            }
        }
    }

    private async createNotificationsChannel(): Promise<void> {
        const channel = new this.androidNotifications.Channel(this.NOTIFICATIONS_CHANNEL_ID, strings.appName, this.androidNotifications.Importance.Max)
            .setDescription(strings.notificationsChannelDescription);

        await this.notifications.android.createChannel(channel);
    }

    private handleForegroundNotifications(): void {
        this.removeNotificationListener = this.notifications.onNotification((notification: Notification) => {
            // Process your notification as required
            notification.android.setChannelId(this.NOTIFICATIONS_CHANNEL_ID);
            notification.android.setAutoCancel(true);
            notification.android.setSmallIcon(this.NOTIFICATIONS_ICON);
            this.notifications.displayNotification(notification);
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
