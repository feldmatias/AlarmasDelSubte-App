import {anything, capture, instance, mock, reset, verify, when} from 'ts-mockito';
import DiContainer from '../../src/di/Container';
import {
    NOTIFICATIONS_ANDROID_DI,
    NOTIFICATIONS_DI,
    NotificationsAndroidModule,
    NotificationsClient,
} from '../../src/notifications/Firebase';
import {Notification} from 'react-native-firebase/notifications';

type androidType = import('react-native-firebase').RNFirebase.notifications.AndroidNotifications;
type channelType = import('react-native-firebase').RNFirebase.notifications.Android.Channel;

class MockNotifications {

    private notificationsMock = mock<NotificationsClient>();
    private realNotifications!: NotificationsClient;
    private androidMock!: androidType;

    private androidNotificationsMock = mock<NotificationsAndroidModule>();
    private realAndroidNotifications!: NotificationsAndroidModule;
    private channelMock!: channelType;
    private removeNotificationListenerMock!: jest.Mock;

    public mock(): void {
        this.realNotifications = DiContainer.get<NotificationsClient>(NOTIFICATIONS_DI);
        DiContainer.rebind<NotificationsClient>(NOTIFICATIONS_DI).toConstantValue(instance(this.notificationsMock));
        this.mockCreateChannel();
        this.mockOnNotification();

        this.realAndroidNotifications = DiContainer.get<NotificationsAndroidModule>(NOTIFICATIONS_ANDROID_DI);
        DiContainer.rebind<NotificationsAndroidModule>(NOTIFICATIONS_ANDROID_DI).toConstantValue(instance(this.androidNotificationsMock));
        this.mockChannel();
    }

    public reset(): void {
        reset(this.notificationsMock);
        DiContainer.rebind<NotificationsClient>(NOTIFICATIONS_DI).toConstantValue(this.realNotifications);

        reset(this.androidNotificationsMock);
        DiContainer.rebind<NotificationsAndroidModule>(NOTIFICATIONS_ANDROID_DI).toConstantValue(this.realAndroidNotifications);
    }

    private mockCreateChannel(): void {
        this.androidMock = mock<androidType>();
        when(this.androidMock.createChannel(anything())).thenResolve();

        when(this.notificationsMock.android).thenReturn(instance(this.androidMock));
    }

    public assertCreateChannelCalled() {
        verify(this.androidMock.createChannel(anything())).called();
        const [channel] = capture(this.androidMock.createChannel).last();
        return channel;
    }

    public assertOnNotificationCalled() {
        verify(this.notificationsMock.onNotification(anything())).called();
        const [displayNotification] = capture(this.notificationsMock.onNotification).last();
        return displayNotification;
    }

    private mockChannel(): void {
        class MockChannel {
            public description?: string;

            public constructor(public channelId: string, public name: string, private importance: number) {
            }

            public setDescription(description: string): MockChannel {
                this.description = description;
                return this;
            }
        }

        // @ts-ignore
        when(this.androidNotificationsMock.Channel).thenReturn(MockChannel);
    }

    private mockOnNotification(): void {
        this.removeNotificationListenerMock = jest.fn();
        when(this.notificationsMock.onNotification(anything())).thenReturn(this.removeNotificationListenerMock);
    }

    public assertNotificationDisplayed(notification: Notification): void {
        verify(this.notificationsMock.displayNotification(notification)).called();
    }

    public assertRemoveNotificationListenerCalled(): void {
        expect(this.removeNotificationListenerMock).toHaveBeenCalled();
    }
}

export default new MockNotifications();
