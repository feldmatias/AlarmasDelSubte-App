import {instance, mock, reset, verify, when} from 'ts-mockito';
import DiContainer from '../../src/di/Container';
import {MESSAGING_DI, MessagingClient} from '../../src/notifications/Firebase';

class MockMessaging {

    private messagingMock = mock<MessagingClient>();
    private realMessaging!: MessagingClient;

    public mock(): void {
        this.realMessaging = DiContainer.get<MessagingClient>(MESSAGING_DI);
        DiContainer.rebind<MessagingClient>(MESSAGING_DI).toConstantValue(instance(this.messagingMock));
    }

    public reset(): void {
        reset(this.messagingMock);
        DiContainer.rebind<MessagingClient>(MESSAGING_DI).toConstantValue(this.realMessaging);
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

export default new MockMessaging();
