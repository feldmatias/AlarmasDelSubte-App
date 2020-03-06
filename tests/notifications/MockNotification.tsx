import {instance, mock, verify, when} from 'ts-mockito';
import {AndroidNotification, Notification} from 'react-native-firebase/notifications';

export class MockNotification {

    private notification: Notification;

    private androidNotification: AndroidNotification;

    public constructor() {
        this.notification = mock<Notification>();
        this.androidNotification = mock<AndroidNotification>();
        when(this.notification.android).thenReturn(instance(this.androidNotification));
    }

    public instance(): Notification {
        return instance(this.notification);
}

    public assertChannelIdSet(channelId: string) {
        verify(this.androidNotification.setChannelId(channelId)).called();
    }

    public assertAutoCancelSet(autoCancel: boolean) {
        verify(this.androidNotification.setAutoCancel(autoCancel));
    }

    public assertSmallIconSet(icon: string) {
        verify(this.androidNotification.setSmallIcon(icon));
    }
}
