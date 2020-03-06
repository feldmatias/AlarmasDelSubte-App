import {instance, mock, reset, when} from 'ts-mockito';
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
}

export default new MockMessaging();
