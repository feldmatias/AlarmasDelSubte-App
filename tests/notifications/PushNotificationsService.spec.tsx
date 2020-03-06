import {PushNotificationsService} from '../../src/notifications/PushNotificationsService';
import DiContainer from '../../src/di/Container';
import MockMessaging from './MockMessaging';
import MockNotifications from './MockNotifications';
import {strings} from '../../src/strings/Strings';
import {MockNotification} from './MockNotification';

describe('Push Notifications Service', () => {

    let pushNotificationsService: PushNotificationsService;

    beforeEach(async () => {
        MockMessaging.mock();
        MockNotifications.mock();
        pushNotificationsService = DiContainer.get<PushNotificationsService>(PushNotificationsService);
    });

    afterEach(() => {
        MockMessaging.reset();
        MockNotifications.reset();
    });

    describe('Notification Permissions', () => {

        it('should not request permissions if already has permissions', async () => {
            MockMessaging.mockHasPermissions(true);

            await pushNotificationsService.start();

            MockMessaging.assertRequestPermissionsCalled(false);
        });

        it('should request permissions if does not have permissions', async () => {
            MockMessaging.mockHasPermissions(false);
            MockMessaging.mockRequestPermissions(true);

            await pushNotificationsService.start();

            MockMessaging.assertRequestPermissionsCalled(true);
        });

        it('should not fail if request permissions fails', async () => {
            MockMessaging.mockHasPermissions(false);
            MockMessaging.mockRequestPermissions(false);

            await pushNotificationsService.start();

            MockMessaging.assertRequestPermissionsCalled(true);
        });

    });

    describe('Notifications Channel', () => {

        it('should create notifications channel', async () => {
            await pushNotificationsService.start();

            const channel = MockNotifications.assertCreateChannelCalled();

            expect(channel.channelId).toEqual('notifications');
            expect(channel.name).toEqual(strings.appName);
            expect(channel.description).toEqual(strings.notificationsChannelDescription);
        });

    });

    describe('Foreground Notifications', () => {

        it('should set foreground notifications handler', async () => {
            await pushNotificationsService.start();

            MockNotifications.assertOnNotificationCalled();
        });

        it('should set channel id to incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockNotifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            notification.assertChannelIdSet('notifications');
        });

        it('should set auto cancel to incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockNotifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            notification.assertAutoCancelSet(true);
        });

        it('should set small icon to incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockNotifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            notification.assertSmallIconSet('ic_notification');
        });

        it('should display incoming notification', async () => {
            const notification = new MockNotification();

            await pushNotificationsService.start();

            const displayNotification = MockNotifications.assertOnNotificationCalled();
            displayNotification(notification.instance());

            MockNotifications.assertNotificationDisplayed(notification.instance());
        });

    });

    describe('Stop', () => {

        it('should not fail if stop before start', async () => {
            await pushNotificationsService.stop();
        });

        it('should stop foreground notifications handler', async () => {
            await pushNotificationsService.start();
            await pushNotificationsService.stop();

            MockNotifications.assertRemoveNotificationListenerCalled();
        });

    });

});
