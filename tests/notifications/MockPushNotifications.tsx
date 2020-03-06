import {anything, capture, instance, mock, reset, verify, when} from 'ts-mockito';
import DiContainer from '../../src/di/Container';
import {PUSH_NOTIFICATIONS_DI, PushNotifications} from '../../src/notifications/Firebase';
import {Messaging} from 'react-native-firebase/messaging';
import {Notification, Notifications} from 'react-native-firebase/notifications';

class MockPushNotifications {

    private firebaseMock = mock<PushNotifications>();
    private realFirebase!: PushNotifications;

    public messaging!: MockMessaging;
    public notifications!: MockNotifications;

    public mock(): void {
        this.realFirebase = DiContainer.get<PushNotifications>(PUSH_NOTIFICATIONS_DI);
        DiContainer.rebind<PushNotifications>(PUSH_NOTIFICATIONS_DI).toConstantValue(instance(this.firebaseMock));
        this.initializeModules();
    }

    public reset(): void {
        reset(this.firebaseMock);
        DiContainer.rebind<PushNotifications>(PUSH_NOTIFICATIONS_DI).toConstantValue(this.realFirebase);
    }

    private initializeModules() {
        this.messaging = new MockMessaging();
        when(this.firebaseMock.messaging()).thenReturn(this.messaging.instance());

        this.notifications = new MockNotifications();
        when(this.firebaseMock.notifications()).thenReturn(this.notifications.instance());
    }
}

class MockMessaging {

    private messagingMock = mock<Messaging>();

    public instance(): Messaging {
        return instance(this.messagingMock);
    }

    public mockToken(token: string): void {
        when(this.messagingMock.getToken()).thenResolve(token);
    }

    public mockHasPermissions(hasPermissions: boolean): void {
        when(this.messagingMock.hasPermission()).thenResolve(hasPermissions);
    }

    public assertRequestPermissionsCalled(called: boolean): void {
        verify(this.messagingMock.requestPermission()).times(called ? 1 : 0);
    }

    public mockRequestPermissions(success: boolean) {
        if (success) {
            when(this.messagingMock.requestPermission()).thenResolve();
        } else {
            when(this.messagingMock.requestPermission()).thenReject();
        }

    }
}

type AndroidNotifications = import('react-native-firebase').RNFirebase.notifications.AndroidNotifications;

class MockNotifications {

    private notificationsMock = mock<Notifications>();

    private androidNotificationsMock!: AndroidNotifications;
    private removeNotificationListenerMock!: jest.Mock;

    public constructor() {
        this.mockCreateChannel();
        this.mockOnNotification();
    }

    public instance(): Notifications {
        return instance(this.notificationsMock)
;}

    private mockCreateChannel(): void {
        this.androidNotificationsMock = mock<AndroidNotifications>();
        when(this.androidNotificationsMock.createChannel(anything())).thenResolve();

        when(this.notificationsMock.android).thenReturn(instance(this.androidNotificationsMock));
    }

    public assertCreateChannelCalled() {
        verify(this.androidNotificationsMock.createChannel(anything())).called();
        const [channel] = capture(this.androidNotificationsMock.createChannel).last();
        return channel;
    }

    private mockOnNotification(): void {
        this.removeNotificationListenerMock = jest.fn();
        when(this.notificationsMock.onNotification(anything())).thenReturn(this.removeNotificationListenerMock);
    }

    public assertOnNotificationCalled() {
        verify(this.notificationsMock.onNotification(anything())).called();
        const [displayNotification] = capture(this.notificationsMock.onNotification).last();
        return displayNotification;
    }

    public assertNotificationDisplayed(notification: Notification): void {
        verify(this.notificationsMock.displayNotification(notification)).called();
    }

    public assertRemoveNotificationListenerCalled(): void {
        expect(this.removeNotificationListenerMock).toHaveBeenCalled();
    }
}

export default new MockPushNotifications();
