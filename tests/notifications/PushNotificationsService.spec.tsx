import {PushNotificationsService} from '../../src/notifications/PushNotificationsService';
import DiContainer from '../../src/di/Container';
import {strings} from '../../src/strings/Strings';
import {MockNotification} from './MockNotification';
import MockPushNotifications from './MockPushNotifications';

describe('Push Notifications Service', () => {

    let pushNotificationsService: PushNotificationsService;

    beforeEach(async () => {
        MockPushNotifications.mock();
        pushNotificationsService = DiContainer.get<PushNotificationsService>(PushNotificationsService);
    });

    afterEach(() => {
        MockPushNotifications.reset();
    });

    describe('Notification Permissions', () => {

        it('should not request permissions if already has permissions', async () => {
            MockPushNotifications.messaging.mockHasPermissions(true);

            await pushNotificationsService.start();

            MockPushNotifications.messaging.assertRequestPermissionsCalled(false);
        });

        it('should request permissions if does not have permissions', async () => {
            MockPushNotifications.messaging.mockHasPermissions(false);
            MockPushNotifications.messaging.mockRequestPermissions(true);

            await pushNotificationsService.start();

            MockPushNotifications.messaging.assertRequestPermissionsCalled(true);
        });

        it('should not fail if request permissions fails', async () => {
            MockPushNotifications.messaging.mockHasPermissions(false);
            MockPushNotifications.messaging.mockRequestPermissions(false);

            await pushNotificationsService.start();

            MockPushNotifications.messaging.assertRequestPermissionsCalled(true);
        });

    });

    describe('Notifications Channel', () => {

        it('should create notifications channel', async () => {
            await pushNotificationsService.start();

            const channel = MockPushNotifications.notifications.assertCreateChannelCalled();

            expect(channel.channelId).toEqual('notifications');
            expect(channel.name).toEqual(strings.appName);
            expect(channel.description).toEqual(strings.notificationsChannelDescription);
        });

    });

    describe('Foreground Notifications', () => {

        it('should set foreground notifications handler', async () => {
            await pushNotificationsService.start();

            MockPushNotifications.notifications.assertOnNotificationCalled();
        });

        it('should set channel id to incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockPushNotifications.notifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            notification.assertChannelIdSet('notifications');
        });

        it('should set auto cancel to incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockPushNotifications.notifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            notification.assertAutoCancelSet(true);
        });

        it('should set small icon to incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockPushNotifications.notifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            notification.assertSmallIconSet('ic_notification');
        });

        it('should display incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockPushNotifications.notifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            MockPushNotifications.notifications.assertNotificationDisplayed(notification.instance());
        });

    });

    describe('Stop', () => {

        it('should not fail if stop before start', async () => {
            await pushNotificationsService.stop();
        });

        it('should stop foreground notifications handler', async () => {
            await pushNotificationsService.start();
            await pushNotificationsService.stop();

            MockPushNotifications.notifications.assertRemoveNotificationListenerCalled();
        });

    });

});
